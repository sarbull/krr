function Node(data) {
  this.data = data;
  this.childrens = [];
}

const onlyUnique = (value, index, self) => { 
  return self.indexOf(value) === index;
};

const removeSpecial = (text) => {
  return text.replace(new RegExp(`[!]`, 'g'), '');
};

const type = (proposition) => {
  return proposition.replace(new RegExp(`[!ABCDEFGHIJLKMNOPQRSTUVWXYZ]`, 'g'), '');
};

function ifAthenB(proposition, data) {
  const AB = proposition.split(type(proposition));

  return [
    new Node([...data, `!${AB[0]}`]),
    new Node([...data, `${AB[1]}`])
  ]
}

function iffAthenB(proposition, data) {
  const AB = proposition.split(type(proposition));

  return [
    new Node([...data, `${AB[0]}^${AB[1]}`]),
    new Node([...data, `!${AB[0]}^!${AB[1]}`])
  ]
}

function ifAorB(proposition, data) {
  const AB = proposition.split(type(proposition));

  return [
    new Node([...data, `${AB[0]} ${AB[1]}`])
  ]
}

function ifAandB(proposition, data) {
  const AB = proposition.split(type(proposition));

  return [
    new Node([...data, `${AB[0]}`]),
    new Node([...data, `${AB[1]}`])
  ]
}

function representation(parent) {
  parent.data.forEach(p => {
    switch(type(p)) {
      case '->':
        ifAthenB(p, [...parent.data.filter(f => f != p)]).forEach(n => {
          parent.childrens.push(n);
        });

        break;
      case '<->':
        iffAthenB(p, [...parent.data.filter(f => f != p)]).forEach(n => {
          parent.childrens.push(n);
        });

        break;
      case '^':
        ifAorB(p, [...parent.data.filter(f => f != p)]).forEach(n => {
          parent.childrens.push(n);
        });

        break;
      case 'v':
        ifAorB(p, [...parent.data.filter(f => f != p)]).forEach(n => {
          parent.childrens.push(n);
        });

        break;
      default:
        break;
    }

    parent.childrens.forEach(c => {
      representation(c);
    });
  });
};

function validate(n, array) {
  if (!n.childrens[0]) {
    return n.data;
  }

  return validate(n.childrens[0], [...array, ...n.childrens[0].data]);
}

let node = new Node(['A->B', 'B->C', 'D->E', 'E->!D']);

representation(node);

let validation = validate(node, node.data);

var unique = validation.map(e => removeSpecial(e))
                       .filter(onlyUnique);

console.log(JSON.stringify(node, null, 2));
console.log(JSON.stringify(validation, null, 2));
console.log(unique.length === validation.length);
