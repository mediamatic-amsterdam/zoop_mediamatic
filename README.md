# Zoöp Seasonal Update  — Mediamatic 2026

An interactive website for all of our progress as a Zoop. 

## Structure
'''
├── index.html        # layout
├── style.css         # all styles (where you can edit colors,fonts,images
├── app.js            # interaction logic
├── data.js           # all goals and interventions (for goals icons) 
└── assets/
    └── icons/        # where assets live (like backgrounds, goal icons, 3D assets, etc)
    '''

## Updating content

The intro text, goals, and interventions (including progress bars) are edited through /admin.html (add the /admin.html tag to the end of the mainpage URL, login and begin changing content) 

Image/video content (not used in the logbook) is stored on GitHub 


### Day to day

Open `admin.html`, log in, edit the intro text or any goal/intervention field (add/remove interventions, reorder them, edit progress), click **Save all changes**. The public site (`index.html`) reads this content live from Supabase on every page load. 

