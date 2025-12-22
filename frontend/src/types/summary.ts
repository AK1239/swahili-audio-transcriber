/** Summary types */
export interface ActionItem {
  person: string;
  task: string;
  dueDate?: string;
}

export interface Summary {
  id: string;
  transcriptionId: string;
  muhtasari: string;
  maamuzi: string[];
  kazi: ActionItem[];
  masualaYaliyoahirishwa: string[];
}

