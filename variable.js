person = {
  name: "Pushkar",
  age: "21",
};
function updateAge(data) {
  data.age = "23";
}
updateAge(person);
console.log("person", person);
// array
array = [
  {
    id: 1,
    name: "Pushkar",
  },
  {
    id: 2,
    name: "Manoj",
  },
];

function updateArray(arr) {
    arr.push({
        id: 3,
        name:"aditi"
    })
}

updateArray(array);
console.log("array", array);