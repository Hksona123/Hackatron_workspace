import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [repoName, setRepoName] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [file, setFile] = useState(null);
  const [commits, setCommits] = useState([]);  // Store commit history

  // Create a new repository
  const createRepo = () => {
    axios.post('http://localhost:5000/create_repo', { repo_name: repoName })
      .then(res => alert(res.data.message))
      .catch(err => alert(err.response.data.error));
  };

  // Commit changes to a repository
  const commitChanges = () => {
    axios.post('http://localhost:5000/commit', { repo_name: repoName, commit_message: commitMessage })
      .then(res => {
        if (res.data) {
          alert(res.data.message);
        } else {
          alert('No data returned from the server.');
        }
      })
      .catch(err => {
        if (err.response && err.response.data) {
          alert(err.response.data.error);
        } else {
          alert('An unknown error occurred.');
        }
      });
  };

  // Fetch and display commit history
  const fetchCommits = () => {
    axios.post('http://localhost:5000/get_commits', { repo_name: repoName })
      .then(res => {
        if (res.data && res.data.commits) {
          setCommits(res.data.commits);  // Save the commit history in state
        } else {
          alert('No commits found.');
        }
      })
      .catch(err => {
        if (err.response && err.response.data) {
          alert(err.response.data.error);
        } else {
          alert('An error occurred. Please try again.');
        }
      });
  };

  // Upload a file to the repository
  const uploadFile = () => {
    if (!file || !repoName) {
      alert('Please select a file and specify a repository name.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('repo_name', repoName);  // Send repo name along with the file

    axios.post('http://localhost:5000/upload_file', formData)
      .then(res => alert(res.data.message))
      .catch(err => {
        if (err.response && err.response.data) {
          alert(err.response.data.error);
        } else {
          alert('An error occurred. Please try again.');
        }
      });
  };

  return (
    <div>
      <h1>SyncWork Workspace</h1>

      {/* Repository Creation */}
      <input
        placeholder="Repository Name"
        value={repoName}
        onChange={e => setRepoName(e.target.value)}
      />
      <button onClick={createRepo}>Create Repo</button>

      {/* File Upload */}
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload File</button>

      {/* Commit Changes */}
      <input
        placeholder="Commit Message"
        value={commitMessage}
        onChange={e => setCommitMessage(e.target.value)}
      />
      <button onClick={commitChanges}>Commit Changes</button>

      {/* Fetch and Show Commit History */}
      <button onClick={fetchCommits}>View Commit History</button>

      {/* Render the commit history */}
      {commits.length > 0 && (
        <div>
          <h2>Commit History for Repository: {repoName}</h2>
          <ul>
            {commits.map((commit, index) => (
              <li key={index}>
                <p><strong>Repository Name:</strong> {repoName}</p>  {/* Show repo name */}
                <p><strong>Message:</strong> {commit.message}</p>
                <p><strong>Author:</strong> {commit.author}</p>
                <p><strong>Date:</strong> {commit.date}</p>
                <p><strong>Files Changed:</strong></p>
                <ul>
                  {commit.files.map((file, idx) => (
                    <li key={idx}>{file}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
