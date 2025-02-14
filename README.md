# meets
 
## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Recommended: LTS version)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm] (https://pnpm.io/)
- [PHP](https://www.php.net/) (>= 8.1)
- [Composer](https://getcomposer.org/)
- [MySQL](https://www.mysql.com/) or PostgreSQL
- [Laravel Queue Worker](https://laravel.com/docs/10.x/queues)

## Installation
### 1. Clone the Repository
```sh
git clone https://github.com/nouredinateur/meets.git
cd meets
```

### 2. Setup the Backend (Laravel)
```sh
cd backend
cp .env.example .env
```

#### Install Dependencies
```sh
composer install
```

#### Configure Environment Variables
Edit the `.env` file and update the following:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Generate Application Key
```sh
php artisan key:generate
```

#### Run Database Migrations
```sh
php artisan migrate --seed
```

#### Start the Laravel Server
```sh
php artisan serve
```

### 3. Setup the Frontend
```sh
cd ../frontend
cp .env.example .env
```

#### Install Dependencies
```sh
npm install  # or yarn install
```

#### Start the Development Server
```sh
npm run dev  # or yarn dev
```

### 4. Running the Queue Worker
To process queued jobs in Laravel, run:
```sh
php artisan queue:work
```
For running queue workers in the background, use a process manager like **Supervisor**.

## API Endpoints
Ensure that the Laravel backend is running before making API requests. Update the `.env` file in the frontend to point to the backend API.

Example `.env` configuration in the frontend:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Additional Commands
- **Clear Cache**: `php artisan cache:clear`
- **Restart Queue Workers**: `php artisan queue:restart`
- **Run Tests**:
  - Backend: `php artisan test`
  - Frontend: `npm test`

## Deployment
For deployment, consider using:
- **Frontend**: Vercel, Netlify, or traditional hosting
- **Backend**: Laravel Forge, AWS, or DigitalOcean
- **Queues**: Supervisor for managing background processes
