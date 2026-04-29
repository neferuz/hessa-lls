import pty
import os
import time

def connect_and_launch():
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp('ssh', ['ssh', '-o', 'StrictHostKeyChecking=no', 'root@83.217.221.84'])
    else:
        # Parent process
        output = b""
        start_time = time.time()
        
        while time.time() - start_time < 10:
            try:
                data = os.read(fd, 1024)
                output += data
                if b'password:' in output.lower():
                    os.write(fd, b'dLf_^B4DpgR5q#\n')
                    break
            except BlockingIOError:
                time.sleep(0.1)
                
        time.sleep(2)
        
        # Launch Commands
        commands = [
            "cd /var/www/hessa/backend && pip3 install -r requirements.txt",
            "pm2 delete hessa-backend hessa-website || true",
            "cd /var/www/hessa/backend && pm2 start uvicorn --name 'hessa-backend' --interpreter python3 -- 'app.main:app' --host 0.0.0.0 --port 8000",
            "cd /var/www/hessa/frontend-website && pm2 start npm --name 'hessa-website' -- run start -- -p 3000",
            "pm2 save",
            "pm2 list",
            "exit"
        ]
        
        for cmd in commands:
            os.write(fd, cmd.encode() + b'\n')
            time.sleep(3) # Wait for each command to start
            
        # Read the final output
        try:
            while True:
                data = os.read(fd, 4096)
                if not data:
                    break
                print(data.decode('utf-8', errors='ignore'), end='')
        except OSError:
            pass

if __name__ == '__main__':
    connect_and_launch()
