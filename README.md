# Twitter Clone Backend

Twitter clone backend built with Prisma, REST API and TypeScript.

## Core Packages

1. prisma - allows us to define our application models and generates CRUD operations from our defined models
2. typescript - adds static typing with optional type annotations to JavaScript
3. jsonwebtoken - authentication
4. nodemailer (sendinblue) - to sent AuthToken via emails.

## Features

- Signup / Login (passwordless auth with token (OTP) send via email)
- User CRUD
- Tweet CRUD
- User ~ Tweet Relationship

## Running locally

### Prisma setup

- You need to have a prisma account
- Make sure to install the prisma cli tool globally in your machine

	```bash
	npm i -g prisma

	# once you created your account, you can login from the terminal
	prisma login
	```

- Once you logged into your account, you need to create a new prisma project

	```bash
	prisma init 
	```

- Copy the 'schema.prisma' file in the 'prisma' folder to the root directory

	```bash
	cp prisma/schema.prisma . # assuming you are present in the root directory
	```

- Then you need to simply deploy the changes you made

	```bash
	prisma deploy
	```

### Environmental variables setup

- Create a .env file at the root directory with the following contents

```javascript
JWT_SECRET=<YOUR_SECRET>
PORT=<PORT>
DATABASE_URL="file:./dev.db"
ADMIN_ACCESS_TOKEN = <TOKEN>
SMTP_HOST=<FROM SEND_IN_BLUE ACCOUNT>
SMTP_PORT=587
SMTP_USER=<FROM SEND_IN_BLUE ACCOUNT>
SMTP_PASSWORD=<FROM SEND_IN_BLUE ACCOUNT>
```

Then run <code>npm i && npm run dev</code> to start the development server