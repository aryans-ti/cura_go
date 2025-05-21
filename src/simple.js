// This is a vanilla JavaScript file that doesn't use React or any frameworks

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the root element where we'll render our content
  const root = document.getElementById('root');
  
  // Create a container element
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.height = '100vh';
  container.style.backgroundColor = '#f0f4f8';
  
  // Create the blue box
  const box = document.createElement('div');
  box.style.padding = '2rem';
  box.style.backgroundColor = '#3b82f6';
  box.style.color = 'white';
  box.style.borderRadius = '0.5rem';
  box.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  box.style.maxWidth = '500px';
  box.style.textAlign = 'center';
  
  // Create heading
  const heading = document.createElement('h1');
  heading.textContent = 'Simple JavaScript Test';
  heading.style.marginBottom = '1rem';
  heading.style.fontSize = '2rem';
  
  // Create paragraph
  const paragraph = document.createElement('p');
  paragraph.textContent = 'If you can see this, JavaScript is working correctly!';
  paragraph.style.fontSize = '1.25rem';
  
  // Add elements to the DOM
  box.appendChild(heading);
  box.appendChild(paragraph);
  container.appendChild(box);
  root.appendChild(container);
  
  console.log('Simple JavaScript loaded and executed successfully');
}); 