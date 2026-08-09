# Incipit
> in-ˈsi-pət, -ˈki- : the first part : beginning. specifically : the opening words of a text of a medieval manuscript or early printed book.

This is a [Next.js](https://nextjs.org) based headless CMS & admin interface for blogging which uses [Auth0](https://auth0.com/) for authentication & [Vercel](https://vercel.com) for hosting and blob storage, [Neon](https://neon.com/) as well as [Prisma](https://www.prisma.io/) for database management.

## Roadmap
- [ ] Table of contents
- [ ] Amount of words
- [ ] How long of a reading time

## Setting up Auth0

This project uses Auth0 for authentication, so you'll need to create an account and set up an application for this project.

Visit the [Auth0 Dashboard](https://manage.auth0.com/dashboard) and create a new application with the type "Regular Web Application".
- Choose "Next.JS" under Technology.
- Leave the Application Origin as `http://localhost:3000` for now and press continue, then update.
- Copy the environment variables under "Integrate into your application" and paste then into a new `.env.local` file. You can use the example file in this repository.

If you'd like to disable registrations so that random people cant sign up and gain admin access, in the sidebar go to:
- Authentication
- Database
- Username-Password-Authentication
- and enable "Disable Sign Ups"

Final step is allowing your production website to use Auth0's API.
To do this, you'll need to add its callback url and logout url to the settings of your application.

In the sidebar go to:
- Applications
- Press the application you created and then scroll down until you see "Allowed Callback URLs"
- Add `https://YOUR_DOMAIN/auth/callback`
- Then scroll down until you see "Allowed Logout URLs"
- Add `https://YOUR_DOMAIN/`

Replace `YOUR_DOMAIN` with your domain, in my case it's `incipit.debugg.co` so each example would be:
- `https://incipit.debugg.co/auth/callback`
- `https://incipit.debugg.co/`

Lastly, press the blue Save button that appears at the bottom of the page.

## Setting up Vercel Blob Storage

This project uses Vercel Blob Storage for storing images a user uploads which are used for cover images on posts as well as images used in the content of a post.

To setup Blob storage with Vercel, navigate in the sidebar to:
- Storage
- Create Database
- Blob > Continue
- Name your database
- Select "Public" under access
- Press Create

Under the quickstart section, press the ".env.local" button and copy the contents into the .env.local file you created in the previous step.

## Setting up Neon through Vercel

Neon is used for storing other user generated content such as posts and tags. 
To setup Neon through Vercel, navigate in the sidebar to:
- Storage
- Create Database
- Neon > Continue
- Skip the first step by pressing Continue
- Enter a name for your database under "Resource Name"
- Press Create

Press Skip if it asks to connect to a project.

Under the quickstart section, press the ".env.local" button and "Show secret" then copy the `DATABASE_URL` row to a `.env` file in the project. (Not the `.env.local` file).

## Running Locally

If it's your first time running this project locally, you'll need to install the dependencies and migrating your database to Neon after having gone through and setup the environment files.

After having installed the dependencies using `npm install`, simply run the following commands in your terminal:
```bash
npx prisma db push

npx prisma generate
```


Then you can run the project locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

When deploying, keep in mind that you need to set up the same environment variables as you did locally.