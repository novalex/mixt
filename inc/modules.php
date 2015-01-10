<?php

// Global options var

// Get Social Profiles & Output Links

function mixt_social_links() {

	global $mixt_opt;

	if (isset($mixt_opt['social-profiles'])) {
		$output = '';
		$before = '<ul class="link-list social-links">';
		$after  = '</ul>';

		foreach ($mixt_opt['social-profiles'] as $k => $profile) {
			$data = explode(', ', $profile);
			if (count($data) > 1) {
				$data_url  = ( isset($data[1]) && filter_var($data[0], FILTER_VALIDATE_URL) ) ? $data[0] : '';
				$data_icon = isset($data[1]) ? $data[1] : '';
				$data_title = isset($data[2]) ? $data[2] : '';

				$output .= '<li><a href="' . $data_url . '" title="' . $data_title . '"><i class="' . $data_icon . '"></i></a></li>';
			}
		}

		return $before . $output . $after;
	}
}