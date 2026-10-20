#!/bin/sh
# safe-push.sh — push the current commit to origin/main from the Cowork
# sandbox, then verify it actually landed.
#
# Why this exists (diagnosed 2026-10-20): plain `git push` from the sandbox
# started failing with "send-pack: unexpected disconnect while reading
# sideband packet / the remote end hung up unexpectedly". The real cause is
# visible in a verbose trace: GitHub 301-redirects the repo URL, git 2.34
# does not carry the token embedded in the remote URL across that redirect,
# and the receive-pack POST gets HTTP 401 ("could not read Username"). The
# read side (fetch, ls-remote) works unauthenticated on a public repo, which
# is why only pushes broke. Sending the token as an explicit Authorization
# header on every request avoids the problem. (The token is read from the
# existing origin URL and never printed.)
#
# Usage: sh scripts/safe-push.sh
# Exit 0 = origin/main == local HEAD. Exit 1 = it did not land.

set -u
LOCAL=$(git rev-parse HEAD)
URL=$(git remote get-url origin)
CRED=${URL#https://}
CRED=${CRED%%@*}
case "$CRED" in
  *:*) U=${CRED%%:*}; P=${CRED#*:} ;;
  *)   U=x-access-token; P=$CRED ;;
esac
AUTH=$(printf '%s:%s' "$U" "$P" | base64 -w0)
CLEAN_URL="https://github.com/GeckMan/Battle-Cats-Progress-Tracker.git"

for attempt in 1 2 3; do
  git -c http.extraheader="Authorization: Basic $AUTH" push "$CLEAN_URL" HEAD:main 2>&1 | sed "s#$P#***#g" | tail -2
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
