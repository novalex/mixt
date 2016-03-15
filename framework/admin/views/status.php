<?php

$this->screen_header(
	esc_html__( 'Status', 'mixt' ),
	esc_html__( 'Check the status of your server and the theme, environmental variables and other information.', 'mixt' )
);

	// Tabs
	$this->tabs();

	// Theme Info Table
	ob_start();
	?>
	<table class="status-table theme-info widefat">
		<thead>
			<tr><th colspan="2"><?php esc_html_e( 'Theme Info', 'mixt' ); ?></th></tr>
		</thead>
		<tbody>
			<tr>
				<td class="label"><?php esc_html_e( 'Version', 'mixt' ); ?></td>
				<td><?php echo MIXT_VERSION; ?></td>
			</tr>
			<tr>
				<td class="label"><?php esc_html_e( 'Child Theme', 'mixt' ); ?></td>
				<td><?php
					if ( ! is_child_theme() ) {
						esc_html_e( 'Yes', 'mixt' );
					} else {
						echo esc_html__( 'No', 'mixt' ) . ' - ' .
							 esc_html__( 'Use a child theme if you intend to modify any code in the theme to keep updating as simple as possible!', 'mixt' );
					}
				?></td>
			</tr>
		</tbody>
	</table>
	<?php
	$theme_info = ob_get_clean();

	// Server Info Table
	ob_start();
	?>
	<table class="status-table server-info widefat margin-top">
		<thead>
			<tr><th colspan="2"><?php esc_html_e( 'Server Info', 'mixt' ); ?></th></tr>
		</thead>
		<tbody>
			<?php
			$server_vars = array(
				'max_execution_time'  => 120,
				'memory_limit'        => 128,
				'post_max_size'       => 32,
				'upload_max_filesize' => 32,
			);
			$has_warn = false;
			foreach ( $server_vars as $var => $min ) {
				$ini_var = ini_get($var);
				if ( intval($ini_var) < $min ) {
					$has_warn = true;
					$color_class = 'red-text';
				} else {
					$color_class =  'green-text';
				}
				echo '<tr>';
					echo "<td class='label'>" . esc_html($var) . "</td><td><strong class='$color_class'>" . esc_html($ini_var) . "</strong> <small>( min " . esc_html($min) . " )</small></td>";
				echo '</tr>';
			}
			?>
		</tbody>
	</table>
	<?php
	$server_info = ob_get_clean();

	if ( $has_warn ) {
		echo '<div class="stuffbox mixt-alert alert-warn margin-top"><p>' .
			esc_html__( 'One or more server configuration variables are set lower than the minimum recommended. This might cause issues!', 'mixt' ) .
		'</p></div>';
	} else {
		echo '<div class="stuffbox mixt-alert alert-ok margin-top"><p>' . esc_html__( 'Everything seems to be in order. Sweet!', 'mixt' ) . '</p></div>';
	}

	echo $theme_info;

	echo $server_info;

$this->screen_footer();

?>