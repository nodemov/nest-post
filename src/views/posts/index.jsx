const React = require('react');
const Layout = require('../layout');

function Index({ posts, isPaginated, pagination, search }) {
    const postsList = isPaginated ? posts.data : posts;

    return (
        <Layout title="All Posts" isAuthenticated={true}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>All Posts</h2>
                    <a href="/v1/posts/web/create" className="btn">+ Create New Post</a>
                </div>

                <form action="/v1/posts/web" method="GET" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="search" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Search</label>
                            <input
                                type="text"
                                id="search"
                                name="search"
                                defaultValue={search}
                                placeholder="Search by title or content..."
                                style={{ width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '5px' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="limit" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Per Page</label>
                            <select
                                id="limit"
                                name="limit"
                                defaultValue={pagination?.limit || 10}
                                onChange={(e) => { e.target.form.submit(); }}
                                style={{ padding: '0.75rem', border: '2px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <button type="submit" className="btn" style={{ marginBottom: 0 }}>Search</button>
                        {search && (
                            <a href="/v1/posts/web" className="btn" style={{ background: '#6c757d', marginBottom: 0 }}>Clear</a>
                        )}
                    </div>
                </form>

                {postsList && postsList.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postsList.map(post => (
                                    <tr key={post.id}>
                                        <td>{post.id}</td>
                                        <td>
                                            <strong>{post.title}</strong>
                                            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                                                {post.detail.substring(0, 80)}{post.detail.length > 80 ? '...' : ''}
                                            </div>
                                        </td>
                                        <td>
                                            {post.deletedAt ? (
                                                <span className="badge badge-deleted">Deleted</span>
                                            ) : post.isActive ? (
                                                <span className="badge badge-active">Active</span>
                                            ) : (
                                                <span className="badge badge-inactive">Inactive</span>
                                            )}
                                        </td>
                                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <a href={`/v1/posts/web/${post.id}`} className="btn btn-sm">View</a>
                                            {' '}
                                            <a href={`/v1/posts/web/${post.id}/edit`} className="btn btn-sm btn-warning">Edit</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {isPaginated && pagination && (
                            <div style={{ marginTop: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
                                    <div>
                                        <strong>Page {pagination.currentPage} of {pagination.totalPages}</strong>
                                        <span style={{ marginLeft: '1rem', color: '#666' }}>Total: {pagination.total} posts</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {pagination.hasPreviousPage && (
                                            <a
                                                href={`/v1/posts/web?page=${pagination.currentPage - 1}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                                                className="btn btn-sm"
                                            >
                                                ← Previous
                                            </a>
                                        )}
                                        {pagination.hasNextPage && (
                                            <a
                                                href={`/v1/posts/web?page=${pagination.currentPage + 1}&limit=${pagination.limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                                                className="btn btn-sm"
                                            >
                                                Next →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="alert alert-success">
                        <p>No posts found. <a href="/v1/posts/web/create">Create your first post!</a></p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

module.exports = Index;
