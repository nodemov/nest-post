const React = require('react');
const Layout = require('../layout');

function Edit({ post }) {
    return (
        <Layout title={`Edit: ${post.title}`}>
            <div style={{ marginBottom: '1rem' }}>
                <a href={`/v1/posts/web/${post.id}`} className="btn btn-sm">← Back to Post</a>
            </div>

            <div className="card">
                <h2>Edit Post</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Update the post information below.</p>

                <form action={`/v1/posts/web/${post.id}`} method="POST">

                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={post.title}
                            required
                            placeholder="Enter post title"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="detail">Content *</label>
                        <textarea
                            id="detail"
                            name="detail"
                            defaultValue={post.detail}
                            required
                            placeholder="Write your post content here..."
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="isActive">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                value="true"
                                defaultChecked={post.isActive}
                                style={{ width: 'auto', marginRight: '0.5rem' }}
                            />
                            Active Post
                        </label>
                        <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                            Inactive posts won't be shown in the public listing
                        </small>
                    </div>

                    <div style={{
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '5px',
                        marginBottom: '1.5rem'
                    }}>
                        <small style={{ color: '#666' }}>
                            <strong>Post ID:</strong> {post.id} |
                            <strong> Created:</strong> {new Date(post.createdAt).toLocaleString()} |
                            <strong> Last Updated:</strong> {new Date(post.updatedAt).toLocaleString()}
                        </small>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-warning">Update Post</button>
                        <a href={`/v1/posts/web/${post.id}`} className="btn" style={{ background: '#6c757d' }}>Cancel</a>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

module.exports = Edit;
