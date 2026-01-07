const React = require('react');
const Layout = require('../layout');

function Create() {
    return (
        <Layout title="Create New Post">
            <div style={{ marginBottom: '1rem' }}>
                <a href="/v1/posts/web" className="btn btn-sm">← Back to Posts</a>
            </div>

            <div className="card">
                <h2>Create New Post</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Fill in the form below to create a new post.</p>

                <form action="/v1/posts/web" method="POST">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
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
                                defaultChecked
                                style={{ width: 'auto', marginRight: '0.5rem' }}
                            />
                            Active Post
                        </label>
                        <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                            Inactive posts won't be shown in the public listing
                        </small>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn">Create Post</button>
                        <a href="/v1/posts/web" className="btn" style={{ background: '#6c757d' }}>Cancel</a>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

module.exports = Create;
