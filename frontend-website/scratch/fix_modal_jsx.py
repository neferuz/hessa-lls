import sys

file_path = '/Users/apple/Desktop/hessa-lls-main/frontend-website/app/profile/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# Replace modal title inline style
content = content.replace('<h3 style={{ marginBottom: \'2rem\' }}>{t.personal.edit}</h3>', '<h3>{t.personal.edit}</h3>')

# Replace preview inline style
old_preview = '<p style={{ fontSize: \'0.75rem\', color: \'#888\', marginTop: \'0.4rem\', marginLeft: \'0.25rem\', fontFamily: \'var(--font-manrope)\' }}>'
new_preview = '<p className={styles.editPreview}>'
content = content.replace(old_preview, new_preview)

with open(file_path, 'w') as f:
    f.write(content)
