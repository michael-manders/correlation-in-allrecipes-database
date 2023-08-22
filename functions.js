// const fs = require("fs");

function makeAnalysis(json, items, cat = false) {
    dataset = {};

    // make a dataset of how many times each item is used with each other item
    for (recipe in json) {
        if (cat && !json[recipe]["categories-listed"].includes(cat)) continue;

        ingredients = json[recipe].ingredients;
        ingredientsCheck = JSON.stringify(ingredients);
        for (item of items) {
            if (!dataset[item]) {
                dataset[item] = {};
            }

            if (!ingredientsCheck.includes(item)) {
                continue;
            }
            for (item2 of items) {
                if (!dataset[item][item2]) {
                    dataset[item][item2] = 0;
                }
                if (ingredientsCheck.includes(item2)) {
                    dataset[item][item2]++;
                }
            }
        }
    }

    // make a correlation matrix
    const variables = Object.keys(dataset);
    const correlationMatrix = [];

    // Calculate mean values for each variable
    const means = {};
    variables.forEach((variable) => {
        const values = Object.values(dataset[variable]);
        const sum = values.reduce((acc, val) => acc + val, 0);
        means[variable] = sum / values.length;
    });

    //  Calculate covariance and populate correlation matrix (thanks chatgpt)
    variables.forEach((variable1) => {
        const correlationRow = [];
        variables.forEach((variable2) => {
            const values1 = Object.values(dataset[variable1]);
            const values2 = Object.values(dataset[variable2]);
            const cov =
                values1.reduce(
                    (acc, val, i) =>
                        acc +
                        (val - means[variable1]) *
                            (values2[i] - means[variable2]),
                    0
                ) / values1.length;
            const stdDev1 = Math.sqrt(
                values1.reduce(
                    (acc, val) => acc + Math.pow(val - means[variable1], 2),
                    0
                ) / values1.length
            );
            const stdDev2 = Math.sqrt(
                values2.reduce(
                    (acc, val) => acc + Math.pow(val - means[variable2], 2),
                    0
                ) / values2.length
            );
            const correlation = cov / (stdDev1 * stdDev2);
            correlationRow.push(parseInt(correlation * 1000) / 1000);
        });
        correlationMatrix.push(correlationRow);
    });

    // console.log(dataset);
    // console.log(correlationMatrix);

    for (let i = 0; i < correlationMatrix.length; i++) {
        correlationMatrix[i] = [items[i]].concat(correlationMatrix[i]);
    }
    correlationMatrix.push([""].concat(items));

    // console.log(correlationMatrix);
    // saveGrid(correlationMatrix);

    return dataset, correlationMatrix;
}

function countIngredients(json, items = false) {
    if (!items) {
        let out = {};
        for (recipe in json) {
            for (item of json[recipe].ingredients) {
                if (!out[item]) {
                    out[item] = 0;
                }
                out[item]++;
            }
        }
        return out;
    } else {
        let out = {};
        for (let i = 0; i < items.length; i++) {
            out[items[i]] = 0;
        }
        for (recipe of json) {
            for (item of items) {
                if (recipe.ingredients.includes(item)) {
                    out[item]++;
                }
            }
        }
        return out;
    }
}

function topX(json, x = false) {
    counts = countIngredients(json);
    let out = [];
    for (item in counts) {
        out.push([item, counts[item]]);
    }
    out.sort((a, b) => b[1] - a[1]);
    if (!x) return out;
    return out.slice(0, x);
}

function saveGrid(array) {
    let string = "";
    for (let i = 0; i < array.length; i++) {
        string += array[i].join(",") + "\n";
    }
    fs.writeFileSync("analysis.csv", string);
}

function listOfItems(json) {
    out = [];
    for (item of topX(json)) out.push(item[0]);
    return out;
}

function mostUsedWith(json, ingreident, x) {
    used = {};
    for (recipe of json) {
        ing = recipe.ingredients;

        if (!ing.includes(ingreident)) continue;

        for (ingredient2 of ing) {
            if (!used[ingredient2]) used[ingredient2] = 0;
            used[ingredient2]++;
        }
    }
    out = [];
    for (i in used) out.push([i, used[i]]);
    out = out.sort((a, b) => b[1] - a[1]);
    out = out.slice(1, x + 1);
    console.log(out);
}

function countCategories(json) {
    cats = {};
    for (recipe of json) {
        for (cat of recipe["categories-listed"]) {
            if (!cats[cat]) cats[cat] = 0;
            cats[cat]++;
        }
    }
    out = [];
    for (i in cats) out.push([i, cats[i]]);
    out = out.sort((a, b) => b[1] - a[1]);
    // console.log(out);
    return out;
}

sample = [
    "basil",
    "pepper",
    "cayenne",
    "cilantro",
    "cinnamon",
    "clove",
    "cumin",
    "curry",
    "dill",
    "garlic powder",
    "ginger",
    "nutmeg",
    "oregano",
    "paprika",
    "parsley",
    "rosemary",
    "sage",
    "sesame",
    "thyme",
    "vanilla",
];

sample2 = [
    "salt",
    "black pepper",
    "white sugar",
    "butter",
    "eggs",
    "garlic",
    "water",
    "flour",
    "onion",
    "olive oil",
    "milk",
    "vanilla extract",
    "vegetable oil",
    "cinnamon",
    "brown sugar",
    "tomatoes",
    "baking powder",
    "lemon juice",
    "baking soda",
    "carrots",
];

//baking
sample3 = [
    "salt",
    "white sugar",
    "butter",
    "milk",
    "eggs",
    "flour",
    "vanilla extract",
    "baking powder",
    "baking soda",
    "brown sugar",
    "yeast",
];

// json = JSON.parse(fs.readFileSync("new_dataset.json"));

// mostUsedWith(json, "quale eggs", 10);
// makeAnalysis(json, sample);
// console.log(countIngredients(JSON.parse(fs.readFileSync("new_dataset.json"))));
// console.log(listOfItems(JSON.parse(fs.readFileSync("new_dataset.json"))));
// console.log(makeAnalysis(json, listOfItems(json)));
// console.log(countCategories(json));
