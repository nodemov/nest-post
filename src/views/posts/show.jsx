const React = require('react');
const Layout = require('../layout');

function Show({ post }) {
    return (
        <Layout title={post.title} isAuthenticated={true}>
            <div style={{ marginBottom: '1rem' }}>
                <a href="/v1/posts/web" className="btn btn-sm">← Back to Posts</a>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>{post.title}</h1>
                        <div className="post-meta">
                            <span>ID: {post.id}</span> |
                            <span> Created: {new Date(post.createdAt).toLocaleString()}</span>
                            {post.updatedAt && post.updatedAt !== post.createdAt && (
                                <span> | Updated: {new Date(post.updatedAt).toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        {post.deletedAt ? (
                            <span className="badge badge-deleted">Deleted</span>
                        ) : post.isActive ? (
                            <span className="badge badge-active">Active</span>
                        ) : (
                            <span className="badge badge-inactive">Inactive</span>
                        )}
                    </div>
                </div>

                <div style={{
                    padding: '1.5rem',
                    background: '#f8f9fa',
                    borderRadius: '5px',
                    borderLeft: '4px solid #667eea',
                    marginBottom: '2rem'
                }}>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{post.detail}</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a href={`/v1/posts/web/${post.id}/edit`} className="btn btn-warning">Edit Post</a>

                    <form
                        action={`/v1/posts/web/${post.id}/delete`}
                        method="POST"
                        style={{ display: 'inline' }}
                        onSubmit={(e) => {
                            if (!confirm('Are you sure you want to delete this post?')) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <button type="submit" className="btn btn-danger">Delete Post</button>
                    </form>

                    {post.deletedAt && (
                        <form
                            action={`/v1/posts/web/${post.id}/restore`}
                            method="POST"
                            style={{ display: 'inline' }}
                        >
                            <button type="submit" className="btn btn-success">Restore Post</button>
                        </form>
                    )}
                </div>
            </div>

            <div className="card">
                <h3>Post Details</h3>
                <table>
                    <tbody>
                        <tr>
                            <td><strong>ID</strong></td>
                            <td>{post.id}</td>
                        </tr>
                        <tr>
                            <td><strong>Title</strong></td>
                            <td>{post.title}</td>
                        </tr>
                        <tr>
                            <td><strong>Active</strong></td>
                            <td>{post.isActive ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                            <td><strong>Created At</strong></td>
                            <td>{new Date(post.createdAt).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td><strong>Updated At</strong></td>
                            <td>{new Date(post.updatedAt).toLocaleString()}</td>
                        </tr>
                        {post.deletedAt && (
                            <tr>
                                <td><strong>Deleted At</strong></td>
                                <td>{new Date(post.deletedAt).toLocaleString()}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout >
    );
}

module.exports = Show;
