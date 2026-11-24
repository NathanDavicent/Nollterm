def matches(topic_filter, topic):
    f = topic_filter.split("/")
    t = topic.split("/")
    for i, level in enumerate(f):
        if level == "#":
            return True                  # resten av topicen matchar, även noll nivåer
        if i >= len(t):
            return False                 # topicen tog slut för tidigt
        if level != "+" and level != t[i]:
            return False                 # "+" matchar vilken nivå som helst
    return len(f) == len(t)              # topicen får inte ha fler nivåer kvar


topic_filter = input().strip()
for _ in range(int(input())):
    topic = input().strip()
    print(f"{topic}: {'ja' if matches(topic_filter, topic) else 'nej'}")
