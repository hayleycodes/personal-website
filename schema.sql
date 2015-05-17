create table if not exists entries (
    id integer primary key autoincrement,
    title text not null,
    image text not null,
    link text not null
);
