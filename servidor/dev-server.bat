@echo off
php -d upload_max_filesize=20M -d post_max_size=20M -d memory_limit=256M -d display_errors=0 -d log_errors=1 -S 127.0.0.1:8011 router.php


