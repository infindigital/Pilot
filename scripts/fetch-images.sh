#!/usr/bin/env bash
# Downloads all site imagery into ./images so the site uses local files (no hot-linking).
# Requires images.unsplash.com and i.pravatar.cc to be on the environment network allowlist.
set -uo pipefail
cd "$(dirname "$0")/.."
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
U="https://images.unsplash.com"
dl(){ # url outpath
  code=$(curl -sL -A "$UA" --max-time 40 -o "$2" -w "%{http_code}" "$1")
  if [ "$code" = "200" ] && [ -s "$2" ]; then echo "  ok   $2"; else echo "  FAIL($code) $2"; rm -f "$2"; return 1; fi
}

# Hero (wide) + About
dl "$U/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=72" images/hero.jpg
dl "$U/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=78" images/about.jpg

# Destinations (portrait 3:4)
declare -A D=(
 [dubai]=1512453979798-5ea266f8880c
 [thailand]=1528181304800-259b08848526
 [maldives]=1514282401047-d79a71a590e8
 [singapore]=1525625293386-3f8f99389edd
 [malaysia]=1596422846543-75c6fc197f07
 [europe]=1502602898657-3e91760cbb34
 [bali]=1537953773345-d172ccf13cf1
 [turkey]=1541432901042-2d8bd64b4a9b
)
for name in "${!D[@]}"; do
  dl "$U/photo-${D[$name]}?auto=format&fit=crop&w=700&h=933&q=74" "images/destinations/$name.jpg"
done

# Testimonial avatars
dl "https://i.pravatar.cc/240?img=12" images/avatars/rohan.jpg
dl "https://i.pravatar.cc/240?img=45" images/avatars/ananya.jpg
dl "https://i.pravatar.cc/240?img=33" images/avatars/imran.jpg

echo "Done."
