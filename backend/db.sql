create table users (
	id int primary key auto_increment,
	first_name varchar(45) not null,
    family_name varchar(45) not null,
    email varchar(45) not null unique,
    password varchar(45) not null,
    cpf char(11) not null,
    role enum("A", "U") default "U",
	created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table orders (
	id int primary key auto_increment,
    id_users int not null,
    total_price decimal(15,2) not null,
    payment_metod varchar(45) not null,
    shipping_postcode varchar(8) not null,
    house_number varchar(20) not null,
    created_at timestamp default current_timestamp,
    foreign key (id_users) references users(id)
);

create table products (
	id int primary key auto_increment,
    name varchar(45) not null,
    description varchar(255) not null,
    price decimal(6,2) not null,
    promotional_price decimal(6,2),
	stock_quantity int not null,
    image varchar(255),
	created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

insert into products(name, description, price, promotional_price, stock_quantity)
values("Aperto de mão aleatório", "Aperto de mão de uma pessoa aleatória. A mesma vai até o endereço de sua casa e aperta a sua mão.", 14.99, null, 28),
	("Unhas de anão", "Unhas de um anão. Obs: Esse anão não é apenas um ser humano baixo, mas um ser mitológico!", 8.99, 5.99, 105),
    ("Nada", "Unidades exclusivas de Nada™️. Contém a ausência de todas as coisas.", 159.99, null, 0),
    ("Frases motivacionais", "Frases motivacionais vindo de uma pessoa aleatória. Caso você queira reouvir, deve gravar a fala.", 17.99, 6.99, 13),
    ("Plano cartesiano", "Um conceito de plano cartesiano, para esfregar na cara do professor que você sabe sobre o assunto.", 59.99, null, 8),
    ("Teorema de Pitágoras", "A patente do conceito do Teorema de Pitágora. Obs: Não é possível comprar apenas a hipotenusa.", 59.99, null, 0),
    ("'Indo ali' esmagado", "O famoso personagem 'Indo Ali', porém esmagado.", 299.99, 249.99, 3),
    ("Careca", "Uma careca. Só a careca (pessoa não inclusa).", 249.99, 199.99, 14),
    ("Rosa choque", "A cor rosa, porém muito chocante!", 149.99, null, 1),
    ("Salada de chupeta", "Uma salada feita com os melhores alimentos possíveis. Ideal para seu filho e para você!", 17.99, 14.99, 104),
    ("Nerd 🤓", "Seja para jogar RPG ou ajudar em um trabalho, um nerd (emoji) pode ser sempre um bom companheiro.", 34.99, 24.99, 37),
    ("Garantia de compra", "Não é ruim quando você faz uma compra e tem medo de que ela não se concretize? Compre agora uma Garantia de Compra, com os melhores benefícios.", 24.99, null, 239),
    ("Entupidor de nariz", "Você é o único entre seus amigos que não tem rinite? Seus problemas acabaram!", 54.99, 39.99, 239),
    ("Trailer da música 'Thriller'", "Trailer de uma das mais famosas músicas do cantor Michael Jackson. Obs: Música não inclusa.", 499.99, null, 1),
    ("Bruno Emo", "O mais famoso (e lindo) de todos: Bruno Emo™️.", 999.99, null, 1),
    ("Pílula de Dilema", "Ao tomar essa pílula, você vive um dilema moral, como o Dilema do Trem.", 94.99, 69.99, 71),
    ("Susto", "Um susto, escondido dentro de uma caixa a escolha. A pessoa que abrir terá uma surpresa.", 14.99, null, 36),
    ("Pílula de Aula de Filosofia e Sociologia", "Você faltou a aula de Filosofia e Sociologia? Não tem problema, veja a aula através desses maravilhosos remédios.", 34.99, null, 0),
    ("Sopro do Norte", "Um vento gélido. Vindo dos mais distantes reinos nas regiões mais geladas do planeta.", 99.99, 84.99, 6),
    ("Microonda", "Uma onda de um microondas. Obs: Não é o aparelho, apenas a onda.", 4.99, null, 132),
    ("Ansiedade", "Você sempre foi uma pessoa calma? Mude isso para sempre. Agora eles não te amam mais (você acha). Contém inseguranças de brinde!", 9.99, null, 139082),
    ("Letra do Alfabeto Árabe", "Aprenda a pronunciar uma letra do alfabeto árabe a escolha.", 4.99, null, 132),
    ("Dado de infinitos lados", "Um dado com todas as possibilidades do mundo. Ao jogá-lo, pode sair todas as obras de Shakespeare ou o número 8 (entre outras possibilidades).", 399.99, null, 3),
    ("Sapatos Gelados", "Você agora pode andar na água, usando esses sapatos que congelam onde você pisa.", 149.99, 99.99, 9),
    ("Divin(h)o", "Um cálice com um vinho divino do divo Dionísio. Ao beber dele, você fica muito poderoso, porém, claramente bêbado.", 199.99, null, 4),
    ("Protetor Solar FPS 100", "Um protetor solar que protege 100% contra os raios ultra-violentos. Passá-lo no corpo o torna imune a queimaduras.", 199.99, 149.99, 26),
    ("Pedra Quântica", "Uma pedra comum, porém, ao deixar de olhar para ela, ela teletransporta.", 99.99, null, 26),
    ("Tira Sombras", "Um produto inovador, que tira a sombras de lugares, deixando o ambiente claro.", 49.99, null, 28);

create table orders_has_products (
    id_orders int,
    id_products int,
    quantity int not null,
    price decimal(6,2) not null,
    primary key (id_orders, id_products),
	foreign key (id_orders) references orders(id),
    foreign key (id_products) references products(id)
);

create table categories (
	id int primary key auto_increment,
    name varchar(45) not null unique,
    description varchar(120)
);
 
insert into categories(name)
values("services"),
	("decoration"),
    ("fantasy"),
    ("concept"),
	("classes"),
    ("famous"),
    ("style"),
	("fashion"),
    ("food"),
    ("companion"),
	("tools"),
    ("receipt"),
    ("medicine"),
	("idol"),
    ("beauty"),
    ("power"),
	("physics"),
    ("clothes");

create table products_has_categories (
    id_products int,
    id_categories int,
    primary key (id_products id_categories),
    foreign key (id_products) references products(id),
    foreign key (id_categories) references categories(id)
);

create table reviews (
    id_users int,
    id_products int,
    rating decimal(2, 1) not null,
    comment varchar(255) not null,
    primary key (id_users, id_products),
    foreign key (id_users) references users(id),
    foreign key (id_products) references products(id),
	created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table favorites (
    id_users int,
    id_products int,
    primary key(id_users, id_products),
    foreign key (id_users) references users(id),
    foreign key (id_products) references products(id),
    favorited_at timestamp default current_timestamp
);