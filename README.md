
1. Clone the repository:
   git clone https://github.com/Barathi19/Bloghub-Backend.git

2. Install dependencies:
npm install

3. Create a .env file in the server directory with the following variables:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

4. Start the server:
npm start
Server should be running at: http://localhost:5000


Auth Routes (/api/auth)

| Method | Endpoint    | Description              | Auth Required |
| ------ | ----------- | ------------------------ | ------------- |
| POST   | `/register` | Register a new user      | No            |
| POST   | `/login`    | Login and get JWT token  | No            |
| POST   | `/logout`   | Logout (token blacklist) | Yes           |

POST /api/auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}

POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

POST /api/auth/logout
Authorization: Bearer jwt_token


Blog Routes (/api/blogs)

| Method   | Endpoint       | Description         | Auth Required |
| ------   | -----------    | --------------------| ------------- |
| GET      | `/blog`        | Get all blogs       | Yes           |
| GET      | `/blog/:id`    | Get single blog     | Yes           |
| POST     | `/blog`        | Create a new blog   | Yes           |
| PUT      | `/blog/:id`    | Update a blog       | Yes           |
| DELETE   | `/logout`      | Delete a blog       | Yes           |

GET /api/blogs
Authorization: Bearer jwt_token

GET /api/blogs/:id
Authorization: Bearer jwt_token
Params: Blog ObjectId

POST /api/blogs
Authorization: Bearer jwt_token
Content-Type: application/json
{
  "title": Your title",
  "content": "Your content"
}


PUT /api/blogs/:id
Authorization: Bearer jwt_token
Params: Blog ObjectId
Content-Type: application/json
{
  "title": Your updated title",
  "content": "Your updated content"
}

DELETE /api/blogs/:id
Authorization: Bearer jwt_token
Params: Blog ObjectId

Blog Routes (/api/users)

| Method   | Endpoint       | Description         | Auth Required |
| ------   | -----------    | --------------------| ------------- |
| GET      | `/me`          | Get user details    | Yes           |

GET /api/users/me
Authorization: Bearer jwt_token