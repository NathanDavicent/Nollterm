def matches(topic_filter, topic):
    f = topic_filter.split("/")
    t = topic.split("/")
    # TODO: "+" matchar exakt en nivå, "#" (sist) matchar resten, även noll nivåer.
    return f == t


topic_filter = input().strip()
for _ in range(int(input())):
    topic = input().strip()
    print(f"{topic}: {'ja' if matches(topic_filter, topic) else 'nej'}")
