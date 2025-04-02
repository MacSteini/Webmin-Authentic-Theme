#!/usr/local/bin/perl

#
# Authentic Theme (https://github.com/authentic-theme/authentic-theme)
# Copyright Ilia Rostovtsev <ilia@virtualmin.com>
# Licensed under MIT (https://github.com/authentic-theme/authentic-theme/blob/master/LICENSE)
#
use strict;

our (%in, %gconfig, %tconfig, %text, $config_directory, $current_theme, %theme_text);

do($ENV{'THEME_ROOT'} . "/authentic-lib.pl");

my %miniserv;
get_miniserv_config(\%miniserv);
load_theme_library();

my $charset = &get_charset();

# Check to add error handler
error_40x_handler();

our %theme_config = (settings($config_directory . "/$current_theme/settings.js",    'settings_'),
                     settings($config_directory . "/$current_theme/settings-admin", 'settings_'),
                     settings($config_directory . "/$current_theme/settings-root",  'settings_'));

# Show pre-login text banner
if ($gconfig{'loginbanner'} &&
    get_env('http_cookie') !~ /banner=1/ &&
    !$in{'logout'}                       &&
    !$in{'failed'}                       &&
    !$in{'timed_out'})
{

    print "Auth-type: auth-required=1\r\n";
    print "Set-Cookie: banner=1; path=/\r\n";
    &PrintHeader($charset);
    print '<!DOCTYPE HTML>', "\n";
    print '<html data-bgs="'
      .
      ( theme_night_mode_login() ? 'nightRider' :
          'gainsboro'
      ) .
      '" class="session_login">', "\n";
    embed_login_head();
    print '<body class="session_login" ' . $tconfig{'inbody'} . '>' . "\n";
    embed_overlay_prebody();
    print
'<div class="form-signin-banner container session_login alert alert-danger" data-dcontainer="1"><i class="fa fa-3x fa-exclamation-triangle"></i><br><br>'
      . "\n";
    my $url = $in{'page'};
    open(BANNER, $gconfig{'loginbanner'});

    while (<BANNER>) {
        s/LOGINURL/$url/g;
        print;
    }

    close(BANNER);
    &footer();
    return;
}

my $sec = lc(get_env('https')) eq 'on' ? "; secure" : "";
if (!$miniserv{'no_httponly'}) {
    $sec .= "; httpOnly";
}
my $sidname = $miniserv{'sidname'} || "sid";
print "Auth-type: auth-required=1\r\n";
print "Set-Cookie: banner=0; path=/$sec\r\n"   if ($gconfig{'loginbanner'});
print "Set-Cookie: $sidname=x; path=/$sec\r\n" if ($in{'logout'});
print "Set-Cookie: redirect=1; path=/$sec\r\n";
print "Set-Cookie: testing=1; path=/$sec\r\n";
&PrintHeader($charset);
print '<!DOCTYPE HTML>', "\n";
print '<html data-bgs="'
  .
  ( theme_night_mode_login() ? 'nightRider' :
      'gainsboro'
  ) .
  '" class="session_login">', "\n";
embed_login_head();
print '<body class="session_login" ' . $tconfig{'inbody'} . '>' . "\n";
embed_overlay_prebody();
print '<div class="container session_login" data-dcontainer="1">' . "\n";

if (&miniserv_using_default_cert()) {
    print '<div class="alert alert-warning" data-defcert>' . "\n";
    print '<strong><i class ="fa fa-exclamation-triangle"></i> ' . $theme_text{'login_warning'} .
      '</strong><br /><span>' . &text('defcert_error', ucfirst(&get_product_name()), ($ENV{'MINISERV_KEYFILE'} || $miniserv{'keyfile'})) . "</span>\n";
    print '</div>' . "\n";
}

if (defined($in{'failed'})) {
    if ($in{'twofactor_msg'}) {
        if ($in{'failed_twofactor_attempt'} > 1) {
            print "<h3>",, "</h3><p></p>\n";
            print '<div class="alert alert-warning" data-twofactor>' . "\n";
            print '<strong><i class ="fa fa-exclamation-triangle"></i> ' . $theme_text{'login_warning'} .
              '</strong><br /><span>' . &theme_text('session_twofailed', &html_escape($in{'twofactor_msg'})) . "</span>\n";
            print '</div>' . "\n";
        }
    } else {
        print '<div class="alert alert-warning">' . "\n";
        print '<strong><i class ="fa fa-exclamation-triangle"></i> ' .
          $theme_text{'login_warning'} . '</strong><br />' . "\n";
        print '<span>' . $theme_text{'theme_xhred_session_failed'} . "</span>\n";
        print '</div>' . "\n";
    }
} elsif ($in{'logout'}) {
    print '<div class="alert alert-success">' . "\n";
    print '<strong><i class ="fa fa-check"></i> ' . $theme_text{'login_success'} . '</strong><br />' . "\n";
    print '<span>' . $theme_text{'session_logout'} . "</span>\n";
    print '</div>' . "\n";
} elsif ($in{'timed_out'}) {
    print '<div class="alert alert-warning">' . "\n";
    print '<strong><i class ="fa fa fa-exclamation-triangle"></i> ' .
      $theme_text{'login_warning'} . '</strong><br />' . "\n";
    print '<span>' . &theme_text('session_timed_out', int($in{'timed_out'} / 60)) . "</span>\n";
    print '</div>' . "\n";
}
print "$text{'session_prefix'}\n";

print &ui_form_start("$gconfig{'webprefix'}/session_login.cgi",
                     "post", undef,
                     "role=\"form\" onsubmit=\"spinner()\"",
                     "form-signin session_login clearfix");

print "<i class=\"wbm-webmin\"></i><h2 class=\"form-signin-heading\"><span> "
  .
  ( &get_product_name() eq "webmin" ? $theme_text{'theme_xhred_titles_wm'} :
      $theme_text{'theme_xhred_titles_um'}
  ) .
  "</span></h2>" . "\n";

# Process logo
embed_logo();

# Login message
my $host;
if ($theme_config{'settings_login_page_server_name'}) {
    $host = $theme_config{'settings_login_page_server_name'};
} elsif ($gconfig{'realname'}) {
    $host = &get_display_hostname();
} else {
    $host = get_env('server_name');
    $host =~ s/:\d+//g;
    $host = &html_escape($host);
}
if ($in{'twofactor_msg'} && $miniserv{'twofactor_provider'}) {
    print '<p class="form-signin-paragraph">' . &theme_text('theme_xhred_login_message_2fa') . '</p>' . "\n";
    print &ui_hidden('user',                     $in{'failed'});
    print &ui_hidden('pass',                     $in{'failed_pass'});
    print &ui_hidden('save',                     $in{'failed_save'});
    print &ui_hidden('failed_twofactor_attempt', $in{'failed_twofactor_attempt'});
    print '<div class="input-group form-group">' . "\n";
    print &ui_textbox("twofactor", undef, 20, 0, undef,
      "autocomplete='one-time-code' autocorrect='off' autocapitalize='none' ".
      "placeholder='$theme_text{'theme_xhred_login_token'}' autofocus", 
      'session_login', 1);
    print '<span class="input-group-addon"><i class="fa fa-fw fa-qrcode"></i></span>' . "\n";
    print '</div>' . "\n";
    print '<div class="form-group form-signin-group">';
    print '<button class="btn btn-info" type="submit"><i class="fa fa-qrcode"></i>&nbsp;&nbsp;' .
      &theme_text('theme_xhred_global_verify') . '</button>' . "\n";
    print '<a class="btn btn-default" href="' . $gconfig{'webprefix'} .
      '/"><i class="fa fa-times-circle-o"></i>&nbsp;&nbsp;' . &theme_text('theme_xhred_global_cancel') . '</a>' . "\n";
    print '</div>';
} else {
    print '<p class="form-signin-paragraph">' . &theme_text('login_message') . '<strong> ' . $host . '</strong></p>' . "\n";
    print '<div class="input-group form-group">' . "\n";
    my $autocomplete = $gconfig{'noremember'} ? "off" : "username";
    print &ui_textbox("user", $in{'failed'}, 20, 0, undef,
      "autocomplete='$autocomplete' autocorrect='off' autocapitalize='none' ".
      "placeholder='$theme_text{'theme_xhred_login_user'}'" .
        (!$in{"failed"} ? ' autofocus' : ''), 'session_login', 1);

    print '<span class="input-group-addon"><i class="fa fa-fw fa-user"></i></span>' . "\n";
    print '</div>' . "\n";
    print '<div class="input-group form-group">' . "\n";
    print &ui_password("pass", undef, 20, 0, undef,
      "autocomplete='off' autocorrect='off' autocapitalize='none' ".
      "placeholder='$theme_text{'theme_xhred_login_pass'}' ".
        ($in{"failed"} ? ' autofocus' : '')."", 
      'session_login', 1);
    print
    print '<span class="input-group-addon"><i class="fa fa-fw fa2 fa2-key"></i></span>' . "\n";
    print '</div>' . "\n";

    if (!$gconfig{'noremember'}) {
        print '<div class="input-group form-group form-group-remember">
        <div class="wh-100p flex-wrapper flex-centered flex-start">
              <span class="awcheckbox awobject solid primary"><input class="iawobject" name="save" value="1" id="save" type="checkbox"> <label class="lawobject" for="save"><span>'
          . $theme_text{'login_save'} . '</span></label></span>
        </div></div>' . "\n";
    }
    print '<div class="form-group form-signin-group">';
    print '<button class="btn btn-primary" type="submit"><i class="fa fa-sign-in"></i>&nbsp;&nbsp;' .
      &theme_text('login_signin') . '</button>' . "\n";

    if ($text{'session_postfix'} =~ "href") {
        my $link = get_link($text{'session_postfix'}, 'ugly');
        print '<a target="_blank" href=' .
          $link->[0] . ' class="btn btn-warning"><i class="fa fa-unlock"></i>&nbsp;&nbsp;' . $link->[1] . '</a>' . "\n";
    }

    print '</div>';

}
print '</form>' . "\n";

&footer();
