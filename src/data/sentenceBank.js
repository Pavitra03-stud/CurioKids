const sentenceBank = [
  // 🐶 ANIMALS
  {
    words: ["The", "dog", "is", "happy"],
    answer: "The dog is happy",
  },
  {
    words: ["The", "cat", "is", "sleeping"],
    answer: "The cat is sleeping",
  },
  {
    words: ["The", "bird", "can", "fly"],
    answer: "The bird can fly",
  },
  {
    words: ["The", "fish", "can", "swim"],
    answer: "The fish can swim",
  },
  {
    words: ["The", "horse", "can", "run"],
    answer: "The horse can run",
  },
  {
    words: ["The", "rabbit", "is", "small"],
    answer: "The rabbit is small",
  },
  {
    words: ["The", "lion", "is", "strong"],
    answer: "The lion is strong",
  },
  {
    words: ["The", "monkey", "likes", "bananas"],
    answer: "The monkey likes bananas",
  },
  {
    words: ["The", "duck", "is", "swimming"],
    answer: "The duck is swimming",
  },
  {
    words: ["The", "frog", "can", "jump"],
    answer: "The frog can jump",
  },

  // 👧 EVERYDAY
  {
    words: ["I", "like", "red", "apples"],
    answer: "I like red apples",
  },
  {
    words: ["I", "can", "read", "books"],
    answer: "I can read books",
  },
  {
    words: ["I", "like", "to", "draw"],
    answer: "I like to draw",
  },
  {
    words: ["I", "can", "run", "fast"],
    answer: "I can run fast",
  },
  {
    words: ["I", "love", "my", "family"],
    answer: "I love my family",
  },
  {
    words: ["I", "have", "a", "blue", "bag"],
    answer: "I have a blue bag",
  },
  {
    words: ["I", "see", "a", "big", "tree"],
    answer: "I see a big tree",
  },
  {
    words: ["I", "eat", "an", "apple"],
    answer: "I eat an apple",
  },
  {
    words: ["I", "drink", "cold", "water"],
    answer: "I drink cold water",
  },
  {
    words: ["I", "like", "green", "leaves"],
    answer: "I like green leaves",
  },

  // 🏠 HOME
  {
    words: ["The", "door", "is", "open"],
    answer: "The door is open",
  },
  {
    words: ["The", "window", "is", "clean"],
    answer: "The window is clean",
  },
  {
    words: ["The", "baby", "is", "sleeping"],
    answer: "The baby is sleeping",
  },
  {
    words: ["Mom", "is", "in", "the", "kitchen"],
    answer: "Mom is in the kitchen",
  },
  {
    words: ["Dad", "is", "reading", "a", "book"],
    answer: "Dad is reading a book",
  },
  {
    words: ["The", "boy", "is", "playing"],
    answer: "The boy is playing",
  },
  {
    words: ["The", "girl", "is", "smiling"],
    answer: "The girl is smiling",
  },
  {
    words: ["The", "room", "is", "clean"],
    answer: "The room is clean",
  },
  {
    words: ["The", "ball", "is", "under", "the", "table"],
    answer: "The ball is under the table",
  },
  {
    words: ["The", "toy", "is", "on", "the", "bed"],
    answer: "The toy is on the bed",
  },

  // 🌳 NATURE
  {
    words: ["The", "sun", "is", "bright"],
    answer: "The sun is bright",
  },
  {
    words: ["The", "sky", "is", "blue"],
    answer: "The sky is blue",
  },
  {
    words: ["The", "moon", "is", "round"],
    answer: "The moon is round",
  },
  {
    words: ["The", "stars", "are", "shining"],
    answer: "The stars are shining",
  },
  {
    words: ["The", "tree", "is", "tall"],
    answer: "The tree is tall",
  },
  {
    words: ["The", "flower", "is", "pink"],
    answer: "The flower is pink",
  },
  {
    words: ["The", "rain", "is", "falling"],
    answer: "The rain is falling",
  },
  {
    words: ["The", "wind", "is", "cold"],
    answer: "The wind is cold",
  },
  {
    words: ["Birds", "sing", "in", "the", "morning"],
    answer: "Birds sing in the morning",
  },
  {
    words: ["The", "grass", "is", "green"],
    answer: "The grass is green",
  },

  // 🍎 FOOD
  {
    words: ["The", "apple", "is", "red"],
    answer: "The apple is red",
  },
  {
    words: ["The", "banana", "is", "yellow"],
    answer: "The banana is yellow",
  },
  {
    words: ["I", "like", "sweet", "mangoes"],
    answer: "I like sweet mangoes",
  },
  {
    words: ["The", "cake", "looks", "yummy"],
    answer: "The cake looks yummy",
  },
  {
    words: ["I", "want", "some", "milk"],
    answer: "I want some milk",
  },
  {
    words: ["The", "cookie", "is", "sweet"],
    answer: "The cookie is sweet",
  },
  {
    words: ["We", "eat", "dinner", "together"],
    answer: "We eat dinner together",
  },
  {
    words: ["I", "like", "orange", "juice"],
    answer: "I like orange juice",
  },

  // 🏫 SCHOOL
  {
    words: ["I", "go", "to", "school"],
    answer: "I go to school",
  },
  {
    words: ["The", "teacher", "is", "kind"],
    answer: "The teacher is kind",
  },
  {
    words: ["I", "write", "in", "my", "book"],
    answer: "I write in my book",
  },
  {
    words: ["We", "read", "a", "story"],
    answer: "We read a story",
  },
  {
    words: ["The", "book", "is", "interesting"],
    answer: "The book is interesting",
  },
  {
    words: ["I", "carry", "my", "bag"],
    answer: "I carry my bag",
  },
  {
    words: ["The", "class", "is", "quiet"],
    answer: "The class is quiet",
  },
  {
    words: ["We", "learn", "new", "words"],
    answer: "We learn new words",
  },

  // ⚽ PLAY
  {
    words: ["I", "play", "with", "my", "friends"],
    answer: "I play with my friends",
  },
  {
    words: ["We", "play", "with", "a", "ball"],
    answer: "We play with a ball",
  },
  {
    words: ["The", "children", "are", "playing"],
    answer: "The children are playing",
  },
  {
    words: ["I", "like", "to", "dance"],
    answer: "I like to dance",
  },
  {
    words: ["We", "sing", "a", "song"],
    answer: "We sing a song",
  },
  {
    words: ["I", "ride", "my", "bike"],
    answer: "I ride my bike",
  },
  {
    words: ["The", "ball", "is", "round"],
    answer: "The ball is round",
  },
  {
    words: ["We", "have", "fun", "together"],
    answer: "We have fun together",
  },

  // 🌟 SLIGHTLY LONGER
  {
    words: ["The", "little", "girl", "is", "happy"],
    answer: "The little girl is happy",
  },
  {
    words: ["The", "small", "dog", "can", "run"],
    answer: "The small dog can run",
  },
  {
    words: ["The", "red", "bird", "is", "singing"],
    answer: "The red bird is singing",
  },
  {
    words: ["The", "boy", "has", "a", "blue", "ball"],
    answer: "The boy has a blue ball",
  },
  {
    words: ["The", "cat", "is", "under", "the", "chair"],
    answer: "The cat is under the chair",
  },
  {
    words: ["The", "dog", "is", "beside", "the", "tree"],
    answer: "The dog is beside the tree",
  },
  {
    words: ["The", "girl", "has", "a", "pink", "dress"],
    answer: "The girl has a pink dress",
  },
  {
    words: ["The", "boy", "is", "holding", "a", "book"],
    answer: "The boy is holding a book",
  },
];

export default sentenceBank;