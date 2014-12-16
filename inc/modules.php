<?php

// Global options var

// Get social profiles & output links

function mixt_social_links() {

	global $mixt_opt;

	if (isset($mixt_opt['social-profiles'])) {
		foreach ($mixt_opt['social-profiles'] as $k => $profile) {
			$data = explode(', ', $profile);
			if (count($data) >= 1) {
				$data_url  = filter_var($data[0], FILTER_VALIDATE_URL) ? $data[0] : '';
				$data_icon = $data[1];
				$data_title = isset($data[2]) ? $data[2] : '';

				echo '<a href="' . $data_url . '" title="' . $data_title . '"><i class="' . $data_icon . '"></i></a>';
			}
		}
	}
}