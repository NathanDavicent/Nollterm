STAGES = ["Build", "Lint", "Test", "Artifact"]
results = input().split()
approvals = int(input())

green = True
for stage, result in zip(STAGES, results):
    # TODO: efter första "fail" ska resten skrivas som "hoppas över"
    print(f"{stage}: {result}")
print("Pipeline: grön")   # TODO: "röd (stannade vid X)" om något steg failade

# TODO: merge kräver grön pipeline OCH minst en godkänd granskning
print("Merge: ja")
