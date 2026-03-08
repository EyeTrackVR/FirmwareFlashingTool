import argparse
import subprocess
import tomllib

BETA_BRANCH = "beta"
MAIN_BRANCH = "main"


def get_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    version_group = parser.add_mutually_exclusive_group()
    version_group.add_argument(
        "--major", help="bump up the major version", action="store_true"
    )
    version_group.add_argument(
        "--minor", help="bump up the minor version", action="store_true"
    )
    version_group.add_argument(
        "--patch", help="bump up the patch version", action="store_true"
    )

    parser.add_argument(
        "--push", help="Push the current changes to origin", action="store_true"
    )
    parser.add_argument("--dry", help="Dry run", action="store_true")

    return parser


def get_git_branch():
    result = subprocess.run(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"], text=True, capture_output=True
    )
    return result.stdout.strip()


def get_latest_tag():
    result = subprocess.run(
        ["git", "tag", "-l", "--sort=-version:refname"], text=True, capture_output=True
    )
    tags = result.stdout.strip().split("\n")
    return tags[0] if tags and tags[0] else None


def get_current_version():
    with open("pyproject.toml", "rb") as f:
        data = tomllib.load(f)
    return data["bumpver"]["current_version"]


def get_update_mode(args: argparse.Namespace):
    if args.major:
        return "major"
    elif args.minor:
        return "minor"

    return "patch"


def update_version_with_bumpver(mode: str, dry_run: bool) -> tuple[bool, str]:
    command = ["uv", "run", "bumpver", "update", f"--{mode}"]
    if dry_run:
        command.append("--dry")

    print("Upgrading version, running:", " ".join(command))
    result = subprocess.run(command, text=True, capture_output=True)
    if result.returncode != 0:
        return False, result.stderr
    else:
        return True, result.stdout


def handle_beta_version_update(args: argparse.Namespace):
    print("[WARNING] You're about to upgrade the BETA version.")
    result = input("Do you want to continue? (y/n): ")
    if result == "y":
        if not any([args.major, args.minor, args.patch]):
            print("No upgrade path selected. WIll try to upgrade beta tag instead.")
        else:
            success, result = update_version_with_bumpver(
                get_update_mode(args), args.dry
            )
            if not success:
                print("Upgrade failed. Exiting.")
                print(f"\nTrace:\n{result}")
                exit(1)
            else:
                print("Version upgrade successful!")
                print("Result:\n", result)

        latest_version = get_current_version()
        latest_tag = get_latest_tag()

        if latest_tag.startswith(f"v{latest_version}") and "beta" in latest_tag:
            current_beta = latest_tag[len(latest_version) + 1 :]
            beta_number = int(current_beta[6:])
            tag_to_set = "v{}-beta.{}".format(latest_version, beta_number + 1)
        else:
            tag_to_set = "v{}-beta.1".format(latest_version)

        print("Setting tag: ", tag_to_set)
        if not args.dry:
            subprocess.run(
                ["git", "tag", "-a", tag_to_set, "-m", f"Release {tag_to_set}"]
            )
        else:
            print("Dry run enabled, skipping")
    else:
        print("Exiting...")
        exit(0)


def handle_main_version_update(args: argparse.Namespace):
    print("[WARNING] You're about to upgrade the MAIN version.")
    result = input("Do you want to continue? (y/n): ")

    if result.lower() == "y":
        if not any([args.major, args.minor, args.patch]):
            print("No upgrade path selected. Exiting.")
            exit(0)

        success, result = update_version_with_bumpver(get_update_mode(args), args.dry)
        if not success:
            print("Upgrade failed. Exiting.")
            print(f"\nTrace:\n{result}")
            exit(1)
        else:
            print("Version upgrade successful!")
            print("Result:\n", result)

        current_version = get_current_version()
        tag_to_set = f"v{current_version}"
        print("Tagging after upgrade to: ", tag_to_set)
        if not args.dry:
            subprocess.run(
                ["git", "tag", "-a", tag_to_set, "-m", f"Release {tag_to_set}"]
            )
        else:
            print("Dry run enabled, skipping")

    else:
        print("Exiting...")
        exit(0)


def main():
    print("Welcome to a release maker helper!")
    print("First, let's check the branch:\n")
    current_branch = get_git_branch()
    print(f"Current branch is: {current_branch} \n")

    if current_branch not in [BETA_BRANCH, MAIN_BRANCH]:
        print("You're not on one of the supported branches!")
        print("Switch to `beta` or `main` in order to make a release!")
        exit(0)

    parser = get_parser()
    parsed_args = parser.parse_args()

    if not parsed_args.dry:
        print("[WARNING] You're not in dry run mode.")
        result = input("Do you want to continue? (y/n): ")
        if result.lower() != "y":
            exit(0)

    if current_branch == BETA_BRANCH:
        handle_beta_version_update(parsed_args)
    else:
        handle_main_version_update(parsed_args)

    if parsed_args.push:
        if parsed_args.dry:
            print("Would push to origin with `git push --follow-tags`")
            exit(0)

        subprocess.run(["git", "push", "--follow-tags"])


if __name__ == "__main__":
    main()
