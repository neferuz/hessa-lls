import pty
import os
import time
import sys

def debug_nginx():
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp('ssh', ['ssh', '-o', 'StrictHostKeyChecking=no', 'root@83.217.221.84'])
    else:
        output = b""
        start_time = time.time()
        while time.time() - start_time < 15:
            try:
                data = os.read(fd, 1024)
                output += data
                if b'password:' in output.lower():
                    os.write(fd, b'dLf_^B4DpgR5q#\n')
                    break
            except:
                time.sleep(0.1)
        
        time.sleep(5)
        # Check Nginx config and PM2
        os.write(fd, b'ls /etc/nginx/sites-enabled/ && cat /etc/nginx/sites-enabled/* && pm2 list\n')
        
        end_time = time.time() + 20
        while time.time() < end_time:
            try:
                data = os.read(fd, 4096)
                if data:
                    print(data.decode('utf-8', errors='ignore'), end='')
                    sys.stdout.flush()
            except:
                time.sleep(0.5)

if __name__ == '__main__':
    debug_nginx()
