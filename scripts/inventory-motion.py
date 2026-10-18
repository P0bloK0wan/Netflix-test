"""Inventory shipped motion without executing an APK or copying its artwork.
Usage: python scripts/inventory-motion.py APK DECODED_DIRECTORY OUTPUT_DIRECTORY
Decode first with Apktool 3.0.3 (--no-src --no-assets); see motion-research.md.
"""
import hashlib
import json
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

apk, decoded, output = map(Path, sys.argv[1:4])
output.mkdir(parents=True, exist_ok=True)
ns = '{http://schemas.android.com/apk/res/android}'
integers = {}
for path in (decoded / 'res/values').glob('*.xml'):
    for item in ET.parse(path).getroot():
        if item.tag == 'integer':
            integers['@integer/' + item.attrib['name']] = item.text
rows, excluded = [], []
for path in sorted((decoded / 'res').rglob('*.xml')):
    if path.parent.name.split('-')[0] not in ('anim', 'animator', 'transition'):
        continue
    tree = ET.parse(path).getroot()
    if not any(e.tag in ('alpha', 'scale', 'translate', 'rotate', 'objectAnimator', 'animator') for e in tree.iter()):
        excluded.append({'path': str(path.relative_to(decoded)), 'reason': 'interpolator-only or empty selector'})
        continue
    properties, durations, interpolators = set(), set(), set()
    for e in tree.iter():
        if e.tag in ('alpha', 'scale', 'translate', 'rotate'):
            properties.add(e.tag)
        if ns+'propertyName' in e.attrib:
            properties.add(e.attrib[ns+'propertyName'])
        if ns+'duration' in e.attrib:
            duration = e.attrib[ns+'duration']
            durations.add(integers.get(duration, duration))
        if ns+'interpolator' in e.attrib:
            interpolators.add(e.attrib[ns+'interpolator'])
    rows.append({'path': str(path.relative_to(decoded)), 'format': 'android-xml',
      'sha256Decoded': hashlib.sha256(path.read_bytes()).hexdigest(),
      'properties': sorted(properties), 'declaredDurationsMs': sorted(durations),
      'interpolators': sorted(interpolators),
      'repeatDeclared': any(ns+'repeatCount' in e.attrib for e in tree.iter()),
      'attribution': 'bundled resource; Netflix/library authorship and runtime usage unverified'})
with zipfile.ZipFile(apk) as archive:
    for name in sorted(archive.namelist()):
        if not name.startswith('assets/lottiefiles/') or not name.endswith('.json'):
            continue
        content = archive.read(name)
        data = json.loads(content)
        rows.append({'path': name, 'format': 'lottie', 'sha256': hashlib.sha256(content).hexdigest(),
          'fps': data['fr'], 'startFrame': data['ip'], 'endFrame': data['op'],
          'durationSeconds': round((data['op']-data['ip'])/data['fr'], 4),
          'canvas': [data.get('w'), data.get('h')], 'layers': len(data.get('layers', [])),
          'markers': data.get('markers', []),
          'attribution': 'bundled in supplied APK; runtime usage and APK signature unverified'})
result = {'apkSha256': hashlib.file_digest(apk.open('rb'), 'sha256').hexdigest(),
          'apktoolVersion': '3.0.3', 'count': len(rows), 'excluded': excluded, 'resources': rows}
(output / 'motion-resources.json').write_text(json.dumps(result, indent=2, ensure_ascii=False)+'\n')
md = ['# Recursos de animação presentes no APK', '',
      f'{len(rows)} arquivos com animação declarada. Análise estática: não prova que todos são exibidos, exclusivos da Netflix ou presentes no website.', '',
      'Excluídos 2 interpoladores isolados e 1 seletor vazio. As durações XML são dos componentes, não somas de sequências. Referências @android dependem do sistema e não foram inventadas.', '',
      '| Nº | Recurso | Propriedades / formato | Duração declarada |', '|---|---|---|---|']
for i, row in enumerate(rows, 1):
    prop = ', '.join(row.get('properties', ['Lottie']))
    duration = ', '.join(row['declaredDurationsMs']) + ' ms' if row['format'] == 'android-xml' else str(row['durationSeconds']) + ' s'
    md.append(f'| {i} | `{row["path"]}` | {prop} | {duration} |')
(output / 'motion-resources.md').write_text('\n'.join(md)+'\n')
print(f'{len(rows)} animation resources; {len(excluded)} non-animations excluded')
