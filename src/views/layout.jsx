const React = require('react');

function Layout({ children, title = 'Posts App' }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <style dangerouslySetInnerHTML={{
                    __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
              background: #f5f5f5;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 20px;
            }
            header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 1.5rem 0;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            header h1 {
              font-size: 2rem;
              margin-bottom: 0.5rem;
            }
            nav {
              margin-top: 1rem;
            }
            nav a {
              color: white;
              text-decoration: none;
              padding: 0.5rem 1rem;
              margin-right: 0.5rem;
              background: rgba(255,255,255,0.2);
              border-radius: 5px;
              display: inline-block;
              transition: all 0.3s ease;
            }
            nav a:hover {
              background: rgba(255,255,255,0.3);
              transform: translateY(-2px);
            }
            main {
              min-height: calc(100vh - 200px);
              padding: 2rem 0;
            }
            footer {
              background: #2c3e50;
              color: white;
              text-align: center;
              padding: 2rem 0;
              margin-top: 3rem;
            }
            .card {
              background: white;
              border-radius: 10px;
              padding: 2rem;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              margin-bottom: 2rem;
            }
            .btn {
              display: inline-block;
              padding: 0.75rem 1.5rem;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              border: none;
              cursor: pointer;
              font-size: 1rem;
              transition: all 0.3s ease;
            }
            .btn:hover {
              background: #5568d3;
              transform: translateY(-2px);
              box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            }
            .btn-danger {
              background: #e74c3c;
            }
            .btn-danger:hover {
              background: #c0392b;
            }
            .btn-success {
              background: #27ae60;
            }
            .btn-success:hover {
              background: #229954;
            }
            .btn-warning {
              background: #f39c12;
            }
            .btn-warning:hover {
              background: #d68910;
            }
            .btn-sm {
              padding: 0.5rem 1rem;
              font-size: 0.875rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              background: white;
            }
            th, td {
              padding: 1rem;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background: #f8f9fa;
              font-weight: 600;
            }
            tr:hover {
              background: #f8f9fa;
            }
            .form-group {
              margin-bottom: 1.5rem;
            }
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 600;
              color: #555;
            }
            input, textarea {
              width: 100%;
              padding: 0.75rem;
              border: 2px solid #ddd;
              border-radius: 5px;
              font-size: 1rem;
              transition: border-color 0.3s ease;
            }
            input:focus, textarea:focus {
              outline: none;
              border-color: #667eea;
            }
            textarea {
              min-height: 150px;
              resize: vertical;
            }
            .alert {
              padding: 1rem;
              border-radius: 5px;
              margin-bottom: 1rem;
            }
            .alert-success {
              background: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }
            .post-meta {
              color: #666;
              font-size: 0.875rem;
              margin-top: 0.5rem;
            }
            .badge {
              display: inline-block;
              padding: 0.25rem 0.75rem;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 600;
            }
            .badge-active {
              background: #d4edda;
              color: #155724;
            }
            .badge-inactive {
              background: #f8d7da;
              color: #721c24;
            }
            .badge-deleted {
              background: #d6d8db;
              color: #383d41;
            }
          `
                }} />
            </head>
            <body>
                <header>
                    <div className="container">
                        <h1>📝 NestJS Posts CRUD</h1>
                        <nav>
                            <a href="/v1/posts/web">All Posts</a>
                            <a href="/v1/posts/web/create">Create Post</a>
                            <a href="/api">API Docs</a>
                        </nav>
                    </div>
                </header>
                <main>
                    <div className="container">
                        {children}
                    </div>
                </main>
                <footer>
                    <div className="container">
                        <p>&copy; 2026 NestJS Posts App with React JSX Views | Built with NestJS + Prisma + PostgreSQL + React 19</p>
                    </div>
                </footer>
            </body>
        </html>
    );
}

module.exports = Layout;
