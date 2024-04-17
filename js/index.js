document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    form.addEventListener('submit', handleSubmit);
  });
  
  function handleSubmit(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search').value;
    searchUsers(searchTerm);
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
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" width="50">
          <a href="#" data-username="${user.login}">${user.login}</a>
        `;
        userList.appendChild(listItem);
      });
  
      userList.addEventListener('click', handleUserClick);
    } catch (error) {
      console.error('Error searching users:', error);
      userList.innerHTML = '<li>Failed to fetch users</li>';
    }
  }
  
  async function handleUserClick(event) {
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
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          `;
          reposList.appendChild(listItem);
        });
      } catch (error) {
        console.error('Error fetching repositories:', error);
        reposList.innerHTML = '<li>Failed to fetch repositories</li>';
      }
    }
  }
  