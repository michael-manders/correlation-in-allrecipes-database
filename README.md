## Explanation

This is a tool to visualize the correlations between ingredients in the AllRecipes database. I was inspired to make this by [this](https://www.reddit.com/r/dataisbeautiful/comments/wuzidf/oc_correlation_between_spices_shared_in_recipes/) Reddit post. It generates a correlation matrix between the selected ingredients and then displays it as a heatmap. The color of each cell represents the correlation factor between the two ingredients.

## How it was made

I first took the dataset from this [internet archive](https://archive.org/details/allrecipes.com_recipes_12042020000000) that contains about 71,000 recipes scraped from AllRecipes. And wrote a python script that parsed the dataset and loaded it into a json file that contains only the relevant information (recipe name, ingredients, category, rating).
Then I downloaded [a text file](https://github.com/schollz/food-identicon/blob/master/ingredients.txt) containing a list of bunch of ingredients. However that list contained a lot of junk items (like ingredients that contained measurements), so I make another python script that removed those items.
The recipes dataset's ingredients were written like "1 cup of flour", so I needed to just isolate the ingredient's name. I found a [python library](https://pypi.org/project/ingredient-parser-nlp/) that could do that, but it wasn't perfect. So after running the ingredients through that, the python script looks through the list of ingredients, and the largest item from that list that is a substring of the ingredient, becomes the ingredient. After running this I had a list of recipes, and their ingredients.
To calculate the correlation matrix, I wrote a javascript function (so it could be hosted on a static website) that takes in a list of ingredients, and a category (if you want to only look at a certain category of recipes), and then calculates the correlation matrix.
Then I wrote a javascript function that takes in the correlation matrix, and generates an image that represents it.
Finally I wrote this webpage to display the image, and allow the user to select the ingredients they want to analyze.

## Limitations

The dataset is not perfect, and there are some issues I could see with it. The primary issue is that the data is fairly western focused, so the correlations will reflect that.
