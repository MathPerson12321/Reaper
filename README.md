# Reaper
I shall steal the time

Progress D1 - 5/23/25:
Timer set up - before start of game
Jsons set up with collecting data systems
Start of reap system

Progress D2 - 5/24/25:
Firebase set up 
Multiplayer is a success - game is barely playable yay
  Sends messages to firebase - uses an event to display to the user
  More functions
  Different js for firebase setup
  Everything works
Can configure cooldown, set it up so it works
Logs all the reaps in firebase - displays the most recent ones
Cooldowns save on reload - cannot bypass that
Efficient data-storing - hope firebase won't crash due to storing of reaps
Fixed bug that displays undefined when cooldown ends or someone reaps


Todo tomorrow:
Make it so that you can't use functions to press buttons while invisible (just add more checks to functions like reaped to make sure you're not on cooldown)
Cybersecurity since firebase is vulnerable
Let people choose usernames - stick that in localstorage (sadly alt creation will happen no matter what)
Add time to user totals - configure in firebase - make table for leaderboard
Cleanup github

