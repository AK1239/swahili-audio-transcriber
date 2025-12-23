"""Swahili summarization prompt templates"""

SWAHILI_SUMMARY_PROMPT_TEMPLATE = """Fanya muhtasari wa mkutano huu kwa Kiswahili sanifu cha Tanzania.

Kutoka kwa nakala hii, toa:

1. MUHTASARI MFUPI (2-3 sentensi)
2. MAAMUZI MUHIMU (orodha ya maamuzi yaliyofanywa)
3. KAZI ZA KUFUATILIA (nani afanye nini, na tarehe ikiwa imetajwa)
4. MASUALA YALIYOAHIRISHWA (majadiliano yaliyoahirishwa kwa mkutano ujao)

Maelezo:
- Tumia sentensi fupi na nukta
- Usibadilisha majina ya watu, miradi, au istilahi za kiteknolojia (kama "deployment", "API", nk)
- Ikiwa kuna mchanganyiko wa Kiswahili na Kiingereza, weka hivyo hivyo
- Jibu kwa JSON format tu, bila maandishi yoyote ya ziada

MUHIMU: Tumia muundo huu wa JSON hasa (bila kubadilisha majina ya uwanja):
{{
  "muhtasari": "muhtasari mfupi wa 2-3 sentensi hapa",
  "maamuzi": ["maamuzi 1", "maamuzi 2"],
  "kazi": [
    {{
      "nani": "jina la mtu",
      "kazi": "kazi ya kufanya",
      "tarehe": "tarehe ikiwa imetajwa au null"
    }}
  ],
  "masuala_yaliyoahirishwa": ["masuala 1", "masuala 2"]
}}

{transcript}

Jibu:"""

