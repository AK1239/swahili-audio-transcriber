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

{transcript}

Jibu:"""

