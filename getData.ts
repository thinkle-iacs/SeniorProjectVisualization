type Project = {
  title: string;
  categories: string[];
  topics: string[];
};

type ProjectData = {
  projects: Project[];
  topics: string[];
};

let LOCAL = 'localData'
export async function fetchProjectData(): Promise<ProjectData | null> {
  document.getElementById('loading').classList.remove('hidden')
  const url = "https://script.google.com/macros/s/AKfycbyJwlNkLfQJAJ7srNj_hLVyZh7VzN0QHdqUkkNpC9F1vEdB3UIgkGXyR4CTOGT3eMKIkA/exec";

  let localData = localStorage.getItem(LOCAL);
  if (localData) {
    try {
      let data = JSON.parse(localData);
      document.getElementById('loading').classList.add('hidden')
      return data;
    } catch (err) {
      console.log(err);
    }
  }
  try {
    // Fetch data from the API
    const response = await fetch(url, { method: 'GET', redirect: 'follow' });

    // Check if the request was successful
    if (!response.ok) {
      console.error("Server response:", response.status, response.statusText);
      return null;
    }

    // Parse and return the JSON data
    const data: ProjectData = await response.json();
    localStorage.setItem(LOCAL, JSON.stringify(data));
    document.getElementById('loading').classList.add('hidden')
    return data;
  } catch (error) {
    // Log any errors to the console
    console.error("Fetch error:", error);
    return null;
  }
}

// Usage example:
fetchProjectData()
  .then(data => {
    if (data) {
      console.log("Fetched data:", data);
    } else {
      console.log("Failed to fetch data");
    }
  });

document.getElementById('forget').addEventListener('click', function() {
    localStorage.removeItem('localData');
    location.reload();
  });
