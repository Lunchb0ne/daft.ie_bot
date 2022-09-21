# daft.ie_bot

Daft.ie caters to nearly 80% of the housing needs in Ireland, but if you are looking for this bot you probably know how bad the situation is to get a house in dublin.

daft.ie bot searches the website for new listings and as soon as it finds one it applies to them on your behalf with your details.


# How to run the bot?

1. Go to daft.ie and search for your area, radius distance, budget, rooms etc

2. Select "Most Recent" from the drop down and copy the URL of the page

3. Paste this URL in the index.js file on ```line 59```

4. Paste as many search criterias as your like, inside the links array, same as step 3

5. Edit your personal information in details array in index.js file on ```line 7```

6. Type command "npm run" in your terminal to run the bot

That's it your bot should be running now

All the best for your house hunting!

# Some More Information

- Whenever the bot applies to a new listing it prints the confirmation message in the terminal
- You can change the frequency of often should the bot run in index.js ```line 52```
- If you are worried about getting your IP banned from setting too many requests to api endpoint, you can try using this - https://www.youtube.com/watch?v=2_r2DxGR7I8


If you feel you can this bot more robust or add any new features please feel free to raise PR. Good luck!
