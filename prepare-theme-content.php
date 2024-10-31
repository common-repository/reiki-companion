<?php

global $wp_filesystem;
$url           = admin_url('options-general.php?page=reiki_companion_after_activation');
$credentialsOK = reiki_Companion::connect_fs($url);
if (!$credentialsOK) {
    exit;
}

$reiki_copy_folders_result = reiki_Companion::copy_dir(reiki_Companion::plugin_path() . "/templates", get_template_directory());
if (is_wp_error($reiki_copy_folders_result)) {
    printf('<div class="notice notice-error"><p>%1$s</p><p>%2$s</p></div>', $reiki_copy_folders_result->get_error_message(), implode("<br/>", $reiki_copy_folders_result->error_data));
    echo "<a href='" . $url . "'>" . __("Go Back", 'reiki-companion') . "</a>";
    exit;
}
if (!$reiki_copy_folders_result) {
    wp_die(__('An error occurred when trying to copy files', 'reiki-companion'));
}

?>


