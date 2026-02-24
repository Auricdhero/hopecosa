# Student Association App

A comprehensive Nuxt 3 application for student associations with user authentication, profile management, and file upload capabilities powered by Supabase.

## Features

- 🔐 **Authentication**: Secure signup and signin with email/password
- 👤 **User Profiles**: Complete bio data management including:
  - Full name and contact information
  - Year group of completion
  - Student ID and major/field of study
  - LinkedIn profile integration
  - Personal bio
- 📁 **File Management**: Upload, organize, and manage files and folders
- 💾 **Cloud Storage**: All data stored securely in Supabase
- 📊 **Dashboard**: Overview of uploads, storage usage, and profile information
- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, responsive design

## Tech Stack

- **Frontend**: Nuxt 3 (Vue 3)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. **Clone or navigate to the project directory**

```bash
cd student-association-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to set up your database and storage
   - Get your project URL and anon key from Project Settings > API

4. **Configure environment variables**

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
student-association-app/
├── assets/
│   └── css/
│       └── main.css          # Global styles and Tailwind config
├── layouts/
│   └── default.vue           # Main layout with navigation
├── middleware/
│   └── auth.ts               # Authentication middleware
├── pages/
│   ├── index.vue             # Landing page
│   ├── dashboard.vue         # User dashboard
│   ├── profile.vue           # Profile management
│   ├── uploads.vue           # File upload and management
│   └── auth/
│       ├── login.vue         # Login page
│       └── signup.vue        # Signup page
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.js        # Tailwind configuration
└── SUPABASE_SETUP.md         # Database setup guide
```

## Database Schema

### Profiles Table

- User profile information including bio, year group, contact details
- One-to-one relationship with auth users

### Uploads Table

- File metadata and references
- Links to Supabase Storage
- Support for folder organization

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete schema details.

## Usage

### For Students

1. **Sign Up**: Create an account with your email and password
2. **Complete Profile**: Add your bio data, year group, and other information
3. **Upload Files**: Share documents, assignments, or resources with the community
4. **Organize**: Use folders to keep your uploads organized
5. **Access Dashboard**: View your statistics and recent uploads

### For Administrators

The app can be extended with admin features:

- User management
- Content moderation
- Analytics and reporting

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate` - Generate static site

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure file storage with access policies
- Password hashing handled by Supabase Auth

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables (SUPABASE_URL, SUPABASE_KEY)
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Nuxt 3:

- Netlify
- Cloudflare Pages
- AWS Amplify
- Railway
- Render

## Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## License

MIT License - feel free to use this project for your student association!

## Support

For issues or questions:

- Check the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) guide
- Review Supabase documentation
- Check Nuxt 3 documentation

## Future Enhancements

Potential features to add:

- [ ] Social features (member directory, messaging)
- [ ] Event management
- [ ] News and announcements
- [ ] Discussion forums
- [ ] File sharing between users
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Mobile app version

---

Built with ❤️ for student associations everywhere!
