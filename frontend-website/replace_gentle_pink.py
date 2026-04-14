import os

def replace_colors(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.css', '.tsx', '.ts')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()

                    if any(c in content for c in ['#7B9B82', '#7b9b82', '#617D67', '#ECF2EE', 'rgba(123, 155, 130', '#f3f7f4', '#e9f2eb', '#f2f6f3']):
                        # Primary
                        content = content.replace('#7B9B82', '#C497A0')
                        content = content.replace('#7b9b82', '#C497A0')
                        
                        # Hover
                        content = content.replace('#617D67', '#AD8089')
                        
                        # Accent Light
                        content = content.replace('#ECF2EE', '#F6EBED')
                        
                        # Shadows RGB
                        content = content.replace('rgba(123, 155, 130,', 'rgba(196, 151, 160,')

                        # Gradients on the main page
                        content = content.replace('#f3f7f4', '#fcf8f9')
                        content = content.replace('#e9f2eb', '#f5ebee')
                        content = content.replace('#f2f6f3', '#f8f2f4')

                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {filepath}")
                except Exception as e:
                    print(f"Failed {filepath}: {e}")

replace_colors('/Users/notferuz/Desktop/hessa-main/frontend-website/components')
replace_colors('/Users/notferuz/Desktop/hessa-main/frontend-website/app')

print("All sage green colors swapped to soft nude-pink palette!")
