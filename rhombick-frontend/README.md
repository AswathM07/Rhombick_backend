# Rhombick Frontend

A modern React-based frontend application for managing customers and invoices, built with Vite, React, Tailwind CSS, and featuring a responsive design with data visualization capabilities.

## 🚀 Features

- **Dashboard**: Overview with statistics, charts, and recent activity
- **Customer Management**: Add, edit, view, and delete customers
- **Invoice Management**: Create, edit, and view detailed invoices
- **Modern UI**: Responsive design with Tailwind CSS
- **Data Visualization**: Charts and analytics using Recharts
- **Print Support**: Print-friendly invoice views
- **Search & Filter**: Easy data filtering and search functionality

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Heroicons & Lucide React
- **UI Components**: Headless UI

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to the Rhombick Backend API

## 🏃‍♂️ Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd rhombick-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
rhombick-frontend/
├── public/
│   ├── _redirects          # Render SPA routing
│   └── ...
├── src/
│   ├── components/         # Reusable UI components
│   │   └── Navbar.jsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx
│   │   ├── CustomerForm.jsx
│   │   ├── Invoices.jsx
│   │   ├── InvoiceForm.jsx
│   │   └── InvoiceView.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
├── render.yaml            # Render deployment config
└── README.md
```

## 🔧 Configuration

### API Configuration
The application is configured to connect to the Rhombick Backend API at:
- **Base URL**: `https://rhombick-bend.onrender.com/api`
- **Endpoints**: 
  - Customers: `/customers`
  - Invoices: `/invoices`

### Environment Variables
For local development with different API endpoints, you can modify the `API_BASE_URL` in `src/services/api.js`.

## 🎨 UI Components

### Dashboard
- Statistics cards showing totals and growth
- Revenue charts using Recharts
- Recent invoices list
- Quick action buttons

### Customer Management
- Customer listing with search and filters
- Add/Edit customer forms with validation
- Customer details view
- Delete confirmation modals

### Invoice Management
- Invoice listing with status indicators
- Comprehensive invoice creation/editing forms
- Dynamic item management
- Tax calculations (CGST, SGST, IGST)
- Professional invoice view with print support

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Deploy to Render

1. **Connect your repository** to Render
2. **Create a new Static Site** on Render
3. **Configure build settings**:
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
4. **Deploy**: Render will automatically build and deploy your app

### Alternative: Manual Build

```bash
# Build for production
npm run build

# Preview the build locally
npm run preview
```

The built files will be in the `dist` directory.

### Render Configuration

The project includes a `render.yaml` file for easy deployment:

```yaml
services:
  - type: web
    name: rhombick-frontend
    env: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

## 🔄 API Integration

The application integrates with the following API endpoints:

### Customers API
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Invoices API
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run start` - Start production server (for Render)

### Code Structure Guidelines

- **Components**: Reusable UI components in `/components`
- **Pages**: Route-level components in `/pages`
- **Services**: API calls and external service integrations
- **Utils**: Helper functions and utilities
- **Hooks**: Custom React hooks for shared logic

## 🎯 Features in Detail

### Dashboard Analytics
- Real-time statistics
- Monthly revenue charts
- Customer and invoice counts
- Growth indicators

### Advanced Invoice Features
- Multi-item invoices
- Automatic tax calculations
- Print-optimized layouts
- PDF export ready (extensible)
- Professional invoice templates

### User Experience
- Loading states and error handling
- Form validation
- Confirmation dialogs
- Responsive navigation
- Search and filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔮 Future Enhancements

- PDF generation for invoices
- Email integration
- Advanced reporting
- User authentication
- Real-time notifications
- Bulk operations
- Export functionality
- Advanced filtering options

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
