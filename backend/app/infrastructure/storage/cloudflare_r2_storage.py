"""Cloudflare R2 storage implementation"""
import asyncio
from pathlib import Path
from uuid import uuid4

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.domain.interfaces.file_storage import FileStorage
from app.shared.logging import get_logger

logger = get_logger(__name__)


class CloudflareR2Storage(FileStorage):
    """Cloudflare R2 storage implementation using S3-compatible API"""
    
    def __init__(
        self,
        account_id: str,
        access_key_id: str,
        secret_access_key: str,
        bucket_name: str,
    ):
        """
        Initialize Cloudflare R2 storage
        
        Args:
            account_id: Cloudflare account ID
            access_key_id: R2 access key ID
            secret_access_key: R2 secret access key
            bucket_name: R2 bucket name
        """
        if not all([account_id, access_key_id, secret_access_key, bucket_name]):
            raise ValueError(
                "All R2 credentials (account_id, access_key_id, secret_access_key, bucket_name) must be provided"
            )
        
        self._bucket_name = bucket_name
        self._endpoint_url = f"https://{account_id}.r2.cloudflarestorage.com"
        
        # Create S3 client configured for R2
        self._s3_client = boto3.client(
            's3',
            endpoint_url=self._endpoint_url,
            aws_access_key_id=access_key_id,
            aws_secret_access_key=secret_access_key,
            config=Config(signature_version='s3v4'),
        )
        
        logger.info(
            "storage.r2.initialized",
            bucket_name=bucket_name,
            endpoint_url=self._endpoint_url,
        )
    
    async def save(self, file_content: bytes, filename: str) -> str:
        """
        Save file to R2
        
        Args:
            file_content: File content as bytes
            filename: Original filename
            
        Returns:
            Object key (path) where file was saved
        """
        # Generate unique filename
        file_extension = Path(filename).suffix
        unique_filename = f"{uuid4()}{file_extension}"
        
        # Upload to R2 (boto3 is sync, so we run it in executor)
        def _put_object():
            self._s3_client.put_object(
                Bucket=self._bucket_name,
                Key=unique_filename,
                Body=file_content,
            )
        
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _put_object)
        
        logger.info(
            "storage.file.saved",
            original_filename=filename,
            saved_path=unique_filename,
            file_size=len(file_content),
            storage_type="r2",
        )
        
        return unique_filename
    
    async def load(self, file_path: str) -> bytes:
        """
        Load file from R2
        
        Args:
            file_path: Object key (path) to file in R2
            
        Returns:
            File content as bytes
            
        Raises:
            FileNotFoundError: If file doesn't exist in R2
        """
        def _get_object():
            return self._s3_client.get_object(
                Bucket=self._bucket_name,
                Key=file_path,
            )
        
        loop = asyncio.get_event_loop()
        
        try:
            response = await loop.run_in_executor(None, _get_object)
            
            # Read the body content (Body is a streaming body, read it in executor)
            def _read_body():
                return response['Body'].read()
            
            content = await loop.run_in_executor(None, _read_body)
            
            logger.debug(
                "storage.file.loaded",
                file_path=file_path,
                file_size=len(content),
                storage_type="r2",
            )
            
            return content
            
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', '')
            if error_code == 'NoSuchKey':
                raise FileNotFoundError(f"File not found in R2: {file_path}") from e
            raise
    
    async def delete(self, file_path: str) -> None:
        """
        Delete file from R2
        
        Args:
            file_path: Object key (path) to file in R2
        """
        def _delete_object():
            self._s3_client.delete_object(
                Bucket=self._bucket_name,
                Key=file_path,
            )
        
        loop = asyncio.get_event_loop()
        
        try:
            await loop.run_in_executor(None, _delete_object)
            
            logger.info(
                "storage.file.deleted",
                file_path=file_path,
                storage_type="r2",
            )
            
        except ClientError as e:
            # Log error but don't raise - deletion is idempotent
            logger.warning(
                "storage.file.delete_failed",
                file_path=file_path,
                error=str(e),
                storage_type="r2",
            )

