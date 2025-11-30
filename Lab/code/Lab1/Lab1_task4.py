class Author:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name


class Book:
    def __init__(self, title, ISBN, author, store=None):
        if store is None:
            store = {}
        self.title = title
        self.ISBN = ISBN
        self.author = author
        self.store = store
        self.store[ISBN] = (title, ISBN, author)

    def output(self):
        return self.store


def search(search_isbn, store):
    if search_isbn in store:
        title, isbn, author = store[search_isbn]
        return f"书名: {title}, ISBN: {isbn}, 作者: {author}"
    else:
        return "not found"


if __name__ == "__main__":
    store = {}
    a1 = Author("张三")
    a2 = Author("李四")

    b1 = Book("Python编程", "001", a1, store)
    b2 = Book("Java编程", "002", a2, store)
    b3 = Book("C++编程", "003", a1, store)

    # print excel
    print(f"{'书名':10} | {'ISBN':5} | {'作者'}")
    print("-" * 30)
    for isbn, (title, _, author) in store.items():
        print(f"{title:10} | {isbn:5} | {author}")

    # search test
    print(search("002", store))
    print(search("004", store))
