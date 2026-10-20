#!/bin/sh
# safe-push.sh — push main from the Cowork sandbox and verify it actually landed.
#
# In that sandbox, `git push` routinely ends with "send-pack: unexpected
# disconnect while reading sideband packet / the remote end hung up
# unexpectedly" EVEN WHEN GITHUB ACCEPTED THE PUSH — the proxy cuts the
# response off after the pack is uploaded. Confirmed 2026-10-20: three
# pushes that reported that error were all on origin/main afterward. So the
# error text proves nothing either way; the only reliable check is whether
# the remote branch now points at our commit.
#
# Usage: sh scripts/safe-push.sh        (pushes current branch to origin/main)
# Exit 0 = remote main == local HEAD. Exit 1 = it genuinely did not land.

set -u
LOCAL=$(git rev-parse HEAD)

for attempt in 1 2 3; do
  git push origin HEAD:main >/dev/null 2>&1
  REMOTE=$(git ls-remote origin refs/heads/main 2>/dev/null | cut -f1)
  if [ "$REMOTE" = "$LOCAL" ]; then
    echo "✓ pushed — origin/main is at $(echo "$LOCAL" | cut -c1-7) (attempt $attempt)"
    exit 0
  fi
  echo "attempt $attempt: origin/main is at $(echo "$REMOTE" | cut -c1-7), expected $(echo "$LOCAL" | cut -c1-7)"
  sleep 3
done

echo "✗ push did not land after 3 attempts (is local behind origin? run: git pull --rebase origin main)"
exit 1
