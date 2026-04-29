import sys

file_path = '/Users/apple/Desktop/hessa-lls-main/frontend-website/app/profile/page.tsx'

with open(file_path, 'r') as f:
    lines = f.readlines()

target_part = '<div className={`${styles.cardIcon} ${styles.emptyStateIcon}`}><div className={styles.cardIcon} style={{ width: 80, height: 80, marginBottom: \'1rem\' }}>'
replacement_part = '<div className={`${styles.cardIcon} ${styles.emptyStateIcon}`}>'

fixed_lines = []
for line in lines:
    if target_part in line:
        fixed_lines.append(line.replace(target_part, replacement_part))
    else:
        fixed_lines.append(line)

with open(file_path, 'w') as f:
    f.writelines(fixed_lines)
