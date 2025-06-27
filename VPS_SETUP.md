# Настройка переменных окружения на VPS сервере

## Вариант 1: Файл .env в корне проекта

1. **Подключитесь к VPS по SSH:**
   ```bash
   ssh username@your-server-ip
   ```

2. **Перейдите в папку с проектом:**
   ```bash
   cd /path/to/your/project
   ```

3. **Создайте файл .env:**
   ```bash
   nano .env
   ```

4. **Добавьте переменные:**
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-digit-app-password
   ```

5. **Сохраните файл** (Ctrl+X, затем Y, затем Enter)

## Вариант 2: Системные переменные окружения

### Ubuntu/Debian:
```bash
# Добавить в ~/.bashrc или ~/.profile
echo 'export GMAIL_USER="your-email@gmail.com"' >> ~/.bashrc
echo 'export GMAIL_APP_PASSWORD="your-16-digit-app-password"' >> ~/.bashrc
source ~/.bashrc
```

### CentOS/RHEL:
```bash
# Добавить в ~/.bash_profile
echo 'export GMAIL_USER="your-email@gmail.com"' >> ~/.bash_profile
echo 'export GMAIL_APP_PASSWORD="your-16-digit-app-password"' >> ~/.bash_profile
source ~/.bash_profile
```

## Вариант 3: Для PM2 (если используете PM2)

1. **Создайте ecosystem.config.js:**
   ```javascript
   module.exports = {
     apps: [{
       name: 'ssr-base',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         GMAIL_USER: 'your-email@gmail.com',
         GMAIL_APP_PASSWORD: 'your-16-digit-app-password'
       }
     }]
   }
   ```

2. **Запустите с PM2:**
   ```bash
   pm2 start ecosystem.config.js
   ```

## Вариант 4: Для Docker

1. **Создайте .env файл:**
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-digit-app-password
   ```

2. **В docker-compose.yml:**
   ```yaml
   version: '3'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       env_file:
         - .env
   ```

## Вариант 5: Для Nginx + Node.js

1. **Создайте файл с переменными:**
   ```bash
   sudo nano /etc/environment
   ```

2. **Добавьте переменные:**
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-digit-app-password
   ```

3. **Перезагрузите переменные:**
   ```bash
   source /etc/environment
   ```

## Проверка настроек

После настройки проверьте, что переменные доступны:

```bash
# Проверить переменные
echo $GMAIL_USER
echo $GMAIL_APP_PASSWORD

# Или в Node.js
node -e "console.log(process.env.GMAIL_USER)"
```

## Перезапуск приложения

После изменения переменных окружения обязательно перезапустите приложение:

```bash
# Если используете PM2
pm2 restart ssr-base

# Если используете systemd
sudo systemctl restart your-app

# Если запускаете напрямую
npm run build
npm start
```

## Безопасность

1. **Не коммитьте .env файлы в Git**
2. **Используйте сложные пароли приложений**
3. **Ограничьте доступ к файлам с переменными:**
   ```bash
   chmod 600 .env
   ```

## Для продакшн хостингов (Vercel, Netlify, etc.)

Настройте переменные окружения в панели управления хостинга:

- **Vercel**: Settings → Environment Variables
- **Netlify**: Site settings → Environment variables
- **Railway**: Variables tab
- **Render**: Environment section 