document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    
    form.addEventListener('submit', handleSubmit);
  });
  
  async function handleSubmit(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search').value;
    await searchUsers(searchTerm);
  }
  
  async function searchUsers(username) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
  
    try {
      const response = await fetch(`https://api.github.com/search/users?q=${username}`);
      const data = await response.json();
  
      if (data.items.length === 0) {
        userList.innerHTML = '<li>No users found</li>';
        return;
      }
  
      data.items.forEach(user => {
        const userName = document.createElement('h2');
        const avatar = document.createElement('img');
        const link = document.createElement('a');
  
        userName.textContent = user.login;
        avatar.src = user.avatar_url;
        link.href = user.html_url;
        link.textContent = 'View Profile';
        link.dataset.username = user.login; // Add data-username attribute
  
        const userContainer = document.createElement('li');
        userContainer.appendChild(userName);
        userContainer.appendChild(avatar);
        userContainer.appendChild(link);
  
        userList.appendChild(userContainer);
      });
  
      // Add event listener to the userList for event delegation
      userList.addEventListener('click', showRepositories);
    } catch (error) {
      console.error('Error searching users:', error);
      userList.innerHTML = '<li>Failed to fetch users</li>';
    }
  }
  
  async function showRepositories(event) {
    event.preventDefault();
    if (event.target.tagName === 'A') {
      const username = event.target.dataset.username;
      const reposList = document.getElementById('repos-list');
      reposList.innerHTML = '';
  
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
  
        if (repos.length === 0) {
          reposList.innerHTML = '<li>No repositories found</li>';
          return;
        }
  
        repos.forEach(repo => {
          const repoName = document.createElement('h2');
          const repoLink = document.createElement('a');
  
          repoName.textContent = repo.name;
          repoLink.href = repo.html_url;
          repoLink.textContent = 'View Repository';
  
          const repoContainer = document.createElement('li');
          repoContainer.appendChild(repoName);
          repoContainer.appendChild(repoLink);
          reposList.appendChild(repoContainer);
        });
      } catch (error) {
        console.error('Error fetching repositories:', error);
        reposList.innerHTML = '<li>Failed to fetch repositories</li>';
      }
    }
  }
  