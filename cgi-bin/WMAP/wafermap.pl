#!/usr/bin/perl
use MIME::Lite;
use DBI;
use Data::Dumper;
use POSIX;
use Time::Local;
use JSON;
use CGI;
use CGI::Session;
use CGI qw(:standard);
use Date::Calc qw(Decode_Month);
use Net::LDAP;
use INFAnalysis;
print "Content-type: application/json\n\n";
my $INFDir='/floor/data/results_map/';
my $cgi=new CGI;
my %input;
$input{part}=$cgi->param('part');
$input{lot}=$cgi->param('lot');
$input{wafer}=$cgi->param('wafer');
$input{pass}=$cgi->param('pass');
$input{layer}=$cgi->param('layer');
my $INF="$INFDir$input{part}/$input{lot}/$input{wafer}";
#$INF="/floor/data/results_map/WA05N26F/TM50465.1T/r_1-2";
#$input{pass}=0;
#$input{layer}="iBinCodeLast";
my $inf_obj = INFAnalysis->new();
$inf_obj->LoadINF($INF);
my $block;
my @goodbin=$inf_obj->getGoodbin();
my $ref_colorgrp=$inf_obj->block('SmWaferFlow')->block('UiDisplay');
if ($input{pass} == 0) {
	$block=$inf_obj->block('SmWaferFlow');
}else{
	my @blocks=$inf_obj->block('SmWaferFlow')->blocks("SmWaferPass");
	$block=$blocks[$input{pass}-1];
}
my @layer=$block->block('MdMapResult')->getLayers($input{layer});
my $coordinate_x=$layer[0]->key("iRowMin");
my $coordinate_y=$layer[0]->key("iColMin");
##############get wf map################3
my @map;
my @tmp_map=$layer[0]->getRowData();
foreach my $rowdata (@tmp_map){
	my @tmp_rowdata=split(/\s/,$rowdata);
	my @rowdata;
	foreach my $string (@tmp_rowdata){
		my $data;
		if ($string =~ /\_/){
			$data='';
		}elsif ($string=~ /\@\@/){
			$data =$string;
		}else{
			$data=hex($string);
		}
		push @rowdata,$data;
	}
	push @map,\@rowdata;
}
###################333end##############################
###############calculate bin grp###########################
my %data;
$data{'total'}=0;
@layer=$inf_obj->block('SmWaferFlow')->getStBinTable('COLR');
foreach my $ref_row (@map){
	foreach my $die (@$ref_row){
		next if ($die eq '');
		next if ($die =~ /\@\@/);
		if (defined $data{$die}){
			$data{$die}+=1;
		}else {
			$data{$die}=1;
		}
		$data{'total'}+=1;
	}
}
my $quantity=0;
foreach my $key ( keys %data){
	foreach my $goodbin(@goodbin){
		if ($goodbin eq $key){
			$quantity+=$data{$key};
		}
	}
}
#####################end #######################
#################get color grp#################
my @tmp_color=$layer[0]->getListData();
my @color;
foreach my $color (@tmp_color) {
	my @tmp_listdata=split(//,$color);
	push @color,@tmp_listdata;
}
my $ref_colorlist=$ref_colorgrp->{data};
my @colorgrp;
foreach my $string (@$ref_colorlist) {
	my %UiDisplay=%$string;
	if ( $UiDisplay{'key'}=~ /CGNM(\w)/ ){
		my %unit;	
		$unit{'color'}=$1;
		$unit{'grp'}=$UiDisplay{'value'};
		push @colorgrp,\%unit;
	}
}
##############end #############################
#######get wafer info###
my %info;
$info{'substrate'}="ID:".$inf_obj->block('SmWaferFlow')->key('SUBSTRATEID');
#print Dumper($block);
$infohost=$block->key('HOST');
$info{'host'}="Host:".$infohost unless ($infohost eq "");
$infost=$block->key('STTI');
$info{'ST'}="ST:".&transtime($infost) unless ($infost eq "");
$infoet=$block->key('ENTI');
$info{'ET'}="ET:".&transtime($infoet)  unless ($infoet eq "");
$infoop=$block->key('OPID');
$info{'OPID'}="Operator:".$infoop unless ($infoop eq "");
$infotp=$block->key('PASS_TYPE');
$info{'Type'}="Type:".$infotp unless ($infotp eq "");
$info{'yield'}="Yield:".sprintf ("%.2f%%", $quantity/$data{'total'} * 100);
my @wfinfo;
foreach my $key (keys %info){
	push @wfinfo,$info{$key};
}
################  end    ############
my %output;
$output{'map'}=\@map;
$output{'color'}=\@color;
$output{'data'}=&sorthash(\%data);
$output{'wfinfo'}=\@wfinfo;
$output{'colorlist'}=\@colorgrp;
$output{'coordinate'}{'x'}=$coordinate_x;
$output{'coordinate'}{'y'}=$coordinate_y;
my $json=to_json(\%output);
print "$json";
sub sorthash {
	my $ref_hash=shift;
	my %hash=%$ref_hash;
	my @sort;
	foreach my $key (sort {$a <=> $b} keys %hash){
		push @sort,"$key:$hash{$key}";
	}
	return \@sort;
}
sub transtime{
        my $time=shift;
        my @time=split(/\s/,$time);
        my $MM=Decode_Month("$time[1]",1);
        return "$time[4]-$MM-$time[2] $time[3]"
}
