const React = require('react');
const Layout = require('../layout');

function Profile({ admin }) {
    return (
        <Layout title="Profile" isAuthenticated={true}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Admin Profile</h2>
                    <form action="/v1/auth/logout" method="POST" style={{ margin: 0 }}>
                        <button type="submit" className="btn" style={{ background: '#dc3545' }}>
                            Logout
                        </button>
                    </form>
                </div>

                <table>
                    <tbody>
                        <tr>
                            <th style={{ width: '200px' }}>ID</th>
                            <td>{admin.id}</td>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <td>{admin.name}</td>
                        </tr>
                        <tr>
                            <th>Username</th>
                            <td>{admin.username}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{admin.email || '-'}</td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ marginTop: '2rem' }}>
                    <a href="/v1/posts/web" className="btn">← Back to Posts</a>
                </div>
            </div>
        </Layout>
    );
}

module.exports = Profile;
