c = open('src/App.jsx').read()
import re
c = re.sub(r'\[C\.(\w+)\]\(http://C\.\w+\)', r'C.\1', c)
c = re.sub(r'\[w\.(\w+)\]\(http://w\.\w+\)', r'w.\1', c)
c = re.sub(r'\[days\.(\w+)\]\(http://days\.\w+\)', r'days.\1', c)
open('src/App.jsx', 'w').write(c)
print('OK', len(c.split('\n')))
