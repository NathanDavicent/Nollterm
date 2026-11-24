STAGES = ["Build", "Lint", "Test", "Artifact"]
results = input().split()
approvals = int(input())

failed_at = None
for stage, result in zip(STAGES, results):
    if failed_at:
        print(f"{stage}: hoppas över")       # pipelinen stannar vid första fel
    else:
        print(f"{stage}: {result}")
        if result == "fail":
            failed_at = stage
print(f"Pipeline: röd (stannade vid {failed_at})" if failed_at else "Pipeline: grön")

if failed_at:
    print("Merge: nej (röd pipeline)")
elif approvals < 1:
    print("Merge: nej (ingen godkänd granskning)")
else:
    print("Merge: ja")
